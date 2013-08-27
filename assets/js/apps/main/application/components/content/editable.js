define(['$', 'rangy/rangy-core', 'App'], function($, rangy, App) {

    rangy.createMissingNativeApi();

    /**
     * @summary
     * Provides custom features for content-editable DIV's
     *
     * @usage
     * Either use Data API: `data-provide="contenteditable"` or initialize manually as jquery plugin:
     * `$('.somediv').contentEditable(options)`. In case of Data API - component will be created
     * automatically on first focus.
     *
     * Additionally you have to enable native browser editable mode with attribute `contenteditable="true"`
     *
     * ### Features
     * Component provides several features. All of them are optional and can be configured using `features`
     * option. By default all available features are enabled.
     *
     * #### Available features:
     *  - __UserMentions__
     *    When user enters `@` character - component will show autocomplete with list of users, and insert
     *    link to person profile when user picks person from list.
     *
     *  - __NewLineOnEnter__
     *    By default contentEditable div produce different markup in different browsers when user hits enter.
     *    When this feature is enabled, enter keypress will always produce <br> for enter.
     *    This feature should be used to mimic textarea behavior. Note however that it shouldn't be applied
     *    in more complex cases, like full-featured WYSIWYG instance or when contentEditable is set to non-div element.
     *
     * @example Mimic textarea (with minimum styling)
     * <div data-provide="contenteditable"
     *     data-features='["UserMentions", "NewLineOnEnter"]'
     *     contenteditable="true"
     *     style="border: 1px solid #ccc; min-height: 100px; text-align: left;"></div>
     *
     * @option features array []
     * List of features that will be applied to this contentEditable. See usage section for list of available features.
     */
    var Editable = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.contentEditable.defaults, options);

        var editor = this;
        $.each(this.options.features, function() {
            var method = 'enable' + this;
            editor[method]();
        });
    };

    Editable.prototype.enableUserMentions = function() {
        this.$element
            .off('.user-mentions')
            .on('keypress.user-mentions', function(e) {
                // Using keypress vs keyup/keydown since it's the only keyboard event that has reliable charCode in e.which
                if ('@' === String.fromCharCode(e.which)) {
                    var $editor = $(this),
                        range = new Selection();

                    // Test that previous symbol is a whitespace (newline or space) or not a text (e.g. DOM element)
                    if (range.isNodeBeginning() || /^[\s]?$/gi.test(range.getText(-1))) {
                        // Make sure that not inside <a>
                        var $focus = $(range.closestFocusElement());
                        if (!$focus.is('a') && !$focus.closest('a').length) {
                            Suggestions.startRange = range.state();
                            Suggestions.prepare($editor, range.getCaretClientPosition(), '');
                        }
                    }
                }
            })
            .on('keyup.user-mentions', function(e) {
                // Using keyup to get full mention string (can't use "keypress", since it fires BEFORE char is inserted to editor)
                if (Suggestions.active) {
                    var range = new Selection(),
                        text = $.trim(range.getText(Suggestions.startRange)); // e.g. @John Doe

                    if (text.charAt(0) === '@') {
                        Suggestions.lastRange = range.state();
                        Suggestions.update(text.substr(1), true);
                    } else {
                        Suggestions.reset();
                    }
                }
            })
            .on('picked.user-mentions', function(e) {
                var $link = $('<a></a>')
                    .text(e.user.label)
                    .attr('rel', 'person')
                    .attr('data-user-id', e.user.value)
                    .attr('href', e.user.href)
                    .addClass('user-mention')
                    .addClass('wo-c-a');

                $(this).focus();
                var range = new Selection();
                range.paste($link.get(0), Suggestions.startRange, Suggestions.lastRange);
                Suggestions.reset();
            });
    };

    Editable.prototype.enableNewLineOnEnter = function() {
        // Normalize enter key handling (insert BR like textarea does)
        this.$element
            .off('.enter-handling')
            .on('keypress.enter-handling', function(e) {
                if (e.which === 13) {
                    e.preventDefault();

                    var sel = new Selection(),
                        br = document.createElement('BR');

                    sel.paste(br); // Note: document.execCommand('insertHTML') works unreliably

                    // Unfortunately it's not all...
                    // We always need additional <br> if we are at the end of inline editing area
                    // (either before next block-level sibling element or in the end of parent element).
                    // Otherwise browsers (Chrome, FF in some cases) will fail to jump to next line.
                    // Surprisingly IE9 works properly, but we affect it with this code, so maybe it's worth to disable it for IE9
                    var el = br.nextSibling;
                    while (el && el.nodeType === 3 /* Node.TEXT_NODE */ && $.trim($(el).text()) === '') {
                        el = el.nextSibling;
                    }

                    if (!el) {
                        // End of parent element
                        sel.paste(document.createElement('BR'));
                    } else {
                        if (el.nodeType === 1 /* Node.ELEMENT_NODE */ && el.nodeName.toUpperCase() !== 'BR' && getComputedStyle(el).display.toUpperCase() === 'BLOCK') {
                            // End of inline editing area
                            sel.paste(document.createElement('BR'));
                        }
                    }
                }
            });
    };

    var Suggestions = {
        active: false,
        $editor: null,
        $dropdown: null,
        interval: null,
        lastText: null,
        delayedUpdate: null,
        prepare: function($editor, position, text) {
            this.reset();
            this.active = true;
            this.$editor = $editor;

            // Show the dropdown with loader, while first set of results is loading
            this.buildList('<li class="message">Type&nbsp;person\'s&nbsp;name...</li>');
            this.position(position);
            this.$dropdown.addClass('open');

            var self = this;

            // Bind navigation in suggestions with up/down keys
            this.$editor.on('keydown.suggestions', function(e) {
                switch (e.which) {
                    case 40: // down arrow
                        var $next = self.$dropdown.find('li.active').removeClass('active').nextAll('.suggestion,.cancel').first();
                        if (!$next.length) {
                            // Cycle to first element
                            $next = self.$dropdown.find('.suggestion,.cancel').first();
                        }
                        $next.addClass('active');
                        return false;
                    case 38: // up arrow
                        var $prev = self.$dropdown.find('li.active').removeClass('active').prevAll('.suggestion,.cancel').first();
                        if (!$prev.length) {
                            // Cycle to last element
                            $prev = self.$dropdown.find('.suggestion,.cancel').last();
                        }
                        $prev.addClass('active');
                        return false;
                    case 27: // escape
                        self.reset();
                        return false;
                    case 32: // space
                        if (!self.$dropdown.find('li.suggestion').length) {
                            self.reset();
                        }
                        break; // do not prevent default
                }
            });


            // Bind suggestion selection by enter key
            // (have to bind separately to keypress to supress editor's default enter keypress)
            this.$editor.keyup(function(e)
            {
                // For some reason which is 0 for tab but the keyCode is correct
                var key = e.which || e.keyCode;

                // Select first on tab or enter
                if (key === 13 || key === 9) {
                    var $active = self.$dropdown.find('.active');
                    if (!$active.length || $active.hasClass('cancel')) {
                        self.reset();
                    } else if ($active.hasClass('suggestion')) {
                        self.pick($active.data('user'));
                    }
                    return false;
                }
            });


            // Bind suggestion selection by mouse click
            this.$dropdown.on('click.suggestions', 'li.suggestion a', function(e) {
                e.preventDefault();
                self.pick($(this).closest('li').data('user'));
            });

            // Bind "cancel" click (using mousedown to keep focus in editor)
            this.$dropdown.on('mousedown.suggestions', 'li.cancel a', function(e) {
                e.preventDefault();
                self.reset();
            });

            // Sample suggestions updates
            this.interval = setInterval(function() {
                if (self.delayedUpdate) {
                    self.update(self.delayedUpdate);
                    self.delayedUpdate = null;
                }
            }, 100);
        },
        reset: function() {
            if (this.$editor) {
                this.$editor.off('.suggestions');
            }
            if (this.$dropdown) {
                this.$dropdown.off('.suggestions');
                this.$dropdown.removeClass('open');
            }
            clearInterval(this.interval);
            this.$editor = null;
            this.active = false;
        },
        position: function(coords) {
            this.$dropdown.css({position: 'absolute', top: coords.top + 20, left: coords.left});
        },
        update: function(text, delay) {
            if (delay) {
                this.delayedUpdate = text;
                return;
            }
            if (this.lastText !== text) {
                this.lastText = text;
                $.get(App.url('/suggest/user'), {q: text})
                    .done($.proxy(this, 'suggest'));
            }
        },
        buildList: function(items) {
            if (!this.$dropdown) {
                this.$dropdown = $('<div class="user-mentions dropdown"><ul class="dropdown-menu"></ul></div>');

                this.$dropdown.find('.dropdown-menu').append([
                    '<li class="divider"></li>',
                    '<li class="cancel"><a>&times;&nbsp;Cancel</a></li>'
                ]);

                this.$dropdown.appendTo('body');
            }

            // Remember which item was selected prior to update and attempt to make it active after update
            var $active, active = this.$dropdown.find('li.active a').data('user-id');

            this.$dropdown
                .find('.dropdown-menu').find('li.suggestion,li.message').remove().end()
                .prepend(items);

            if (active) {
                $active = this.$dropdown.find('a[data-user-id="' + active + '"]').parent('li');
            }
            if (!$active || !$active.length) {
                // If there were no active (or old active doesn't present now) - make first one active
                $active = this.$dropdown.find('li.suggestion').first();
            }
            $active.addClass('active');
        },
        suggest: function(users) {
            var items;

            if (!users.length) {
                items = $('<li class="message">No&nbsp;Matches...</li>');
            } else {
                items = $.map(users, function(user) {
                    return $('<li class="suggestion"><a data-user-id="' + user.value + '">' + user.label + '</a></li>')
                        .data('user', user).get(0);
                });
            }
            this.buildList(items);
        },
        pick: function(user) {
            if (!user) {
                return;
            }
            this.$editor.trigger({type: 'picked', user: user});
        }
    };

    // Supporting functions:
    function getComputedStyle(element) {
        var style = "getComputedStyle" in window ? window.getComputedStyle(element, null) : element.currentStyle;
        return style;
    }

    // Encapsulate DOM Selection/Range methods that we use
    var Selection = function() {
        this.selection = window.rangy ? window.rangy.getSelection() : window.getSelection();
        this.range = this.selection.getRangeAt(0);
    };

    Selection.createRange = function() {
        return window.rangy ? rangy.createRange(document) : document.createRange();
    };

    Selection.restore = function(state) {
        var range = Selection.createRange();
        range.setStart(state.startContainer, state.startOffset);
        range.setEnd(state.endContainer, state.endOffset);

        var instance = new Selection();
        instance.range = range;
        return instance;
    };

    $.extend(Selection.prototype, {
        getCaretClientPosition: function() {
            // Looks like the only reliable way to find a coordinate is to temporary insert span and get it's position
            // (original approach with this.range.getClientRects doesn't work in IE, even IE9, although it claims to support it)
            // See also:
            // http://mail.dojotoolkit.org/pipermail/dojo-interest/2010-October/050424.html
            // http://dev.ckeditor.com/ticket/9361
            var range, coords, $span = $('<span></span>').text("\ufeff").css('line-height', 0); // span must have a content for IE8-

            range = this.range.cloneRange();
            range.insertNode($span.get(0));
            coords = $span.offset();
            $span.remove();

            return coords;
        },
        isNodeBeginning: function() {
            return this.range && this.range.startOffset === 0;
        },
        getText: function(leftOffset, rightOffset) {
            var range = this._prepareRange(leftOffset, rightOffset);
            var result = range.toString();
            range.detach();

            return result;
        },
        paste: function(node, leftOffset, rightOffset) {
            var range = this._prepareRange(leftOffset, rightOffset);
            range.deleteContents();
            range.collapse(true);
            range.insertNode(node);

            this.setCaretAfter(node);
        },
        _prepareRange: function(leftOffset, rightOffset) {
            var range = this.range.cloneRange();

            if (leftOffset && leftOffset._state) {
                leftOffset = Selection.restore(leftOffset);
            }
            if (rightOffset && rightOffset._state) {
                rightOffset = Selection.restore(rightOffset);
            }

            if (leftOffset instanceof Selection) {
                range.setStart(leftOffset.range.startContainer, leftOffset.range.startOffset);
            } else {
                range.setStart(this.range.startContainer, this.range.startOffset + (leftOffset || 0));
            }
            if (rightOffset instanceof Selection) {
                range.setEnd(rightOffset.range.endContainer, rightOffset.range.endOffset);
            } else {
                range.setEnd(this.range.endContainer, this.range.endOffset + (rightOffset || 0));
            }
            return range;
        },
        setCaretAfter: function(node) {
            var range = Selection.createRange();
            range.setStartAfter(node);
            range.setEndAfter(node);
            this.selection.removeAllRanges();
            this.selection.addRange(range);
        },
        closestFocusElement: function() {
            if (this.selection.focusNode.nodeType === 1) { // Node.ELEMENT_NODE
                return this.selection.focusNode;
            } else {
                return $(this.selection.focusNode).parent()[0];
            }
        },
        detach: function() {
            this.selection.detach();
        },
        state: function() {
            // Unfortunately need this function, because WebKit modifies range as it wishes in some cases
            // (even changes offsets!)
            return {
                _state: true,
                startContainer: this.range.startContainer,
                startOffset: this.range.startOffset,
                endContainer: this.range.endContainer,
                endOffset: this.range.endOffset
            };
        }
    });


    // jQuery plugin
    $.fn.extend({
        contentEditable: function(option) {
            return this.each(function() {
                var $this = $(this),
                    data = $this.data('editable'),
                    options = typeof option == 'object' && option;

                // Setup
                if (!data) {
                    $this.data('editable', (data = new Editable($this, options)));
                }
                // Method invokation
                if ($.type(option) === 'string') {
                    data[option]();
                }
            });
        }
    });

    $.fn.contentEditable.defaults = {
        features: ['UserMentions', 'NewLineOnEnter']
    };

    // Data API for editable
    $(document).on('focusin.editable.content', '[data-provide="contenteditable"]', function() {
        var $this = $(this);
        if ($this.data('editable')) {
            return;
        }
        $this.contentEditable($this.data());
    });
});
