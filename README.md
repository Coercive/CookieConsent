# CookieConsent
CookieConsent is a micropackage (css, js, php) to easily manage user consent at the cookie level of a site.

# How to configure popup
```json
{ 
    "settings": 
    { 
        "lang": "EN",
        "name": "cookieconsent",
        "accept": "ALL",
        "decline": "NONE",
        "accept_duration": 365,
        "decline_duration": 365,
        "configure_duration": 365
    },
    "popup":
    {
        "title": "Configure cookies",
        "description": "Hello! This is an example of text description in cookie popup.",
        "btn_decline": "Decline",
        "btn_configure": "Configure",
        "btn_accept": "Accept"
    },
    "configure":
    {
        "title": "Configure each cookie",
        "description": "",
        "btn_back": "Back",
        "btn_save": "Save selection",
        "options":
        {
            "SYSTEM":
            {
                "id": "SYSTEM",
                "disabled": true,
                "title": "System cookies",
                "description": "System cookies essential for the proper functioning of the site."
            },
            "GOOGLE_ANALYTICS":
            {
                "id": "GOOGLE_ANALYTICS",
                "disabled": false,
                "title": "Google Analytics",
                "description": "Example of description text."
            },
            "FACEBOOK":
            {
                "id": "FACEBOOK",
                "disabled": false,
                "title": "Facebook",
                "description": "Example of description text."
            },
            "YOUTUBE":
            {
                "id": "YOUTUBE",
                "disabled": false,
                "title": "YouTube",
                "description": "Example of description text."
            }
        }
    }
}
```

# Start JS (basic example)
```js
require('./plugin/CookieConsent');

new CookieConsent(json_data).load();
```

# Ask for consent again
Example of a new request for consent at the cookie level, if for example certain content is inaccessible as such and you want to offer the user to reconsider his choice.
```js
var $reConsentPopup = $('.cookieconsent-reload-popup');
if($reConsentPopup.length) {
    $reConsentPopup.click(function (event) {
        event.preventDefault();
        event.stopPropagation();
        new CookieConsent(json_data, {reload: true}).start();
    })
}
```

# Configure CSS
You can copy and rewrite partialy the css file, or just declare some variables.
```scss
// Color of accept button
$cookieconsent-color-btn-accept: 'red';

// Font title
%cookieconsent-font-title {
    font-family: something;
    // you can add extra styles
}
// Font text
%cookieconsent-font-text {
    font-family: something;
    // you can add extra styles
}
// Font button
%cookieconsent-font-btn {
    font-family: something;
    // you can add extra styles
}
```

# Picture
The given cookie image in /dist/img/cookie.png is free of use.