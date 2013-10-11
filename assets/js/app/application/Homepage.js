define([
    '$',
    'Application/shared/events',
    'Application/module/content/events',
    'Application/components/content/editable'
], function($, shareEvents, contentEvents) {

    return { events: [shareEvents, contentEvents] };
});