(function($){ $(function() {

    /**
     * Management of user consent regarding the use of cookies.
     *
     * @use ES5
     * @use JavaScript Cookie v2.2.1 https://github.com/js-cookie/js-cookie
     *
     * @author Anthony Moral <contact@coercive.fr>
     *
     * @param {object} [data]
     * @param {object} [options]
     * @returns {void}
     * @constructor
     */
    var CookieConsent = function (data, options)
    {
        this.data = data || {};
        this.options = $.extend({}, this.defaults, options ? options : {});
        this.cookie = Cookies;
    };

    /**
     * Automatic loading: detects if the config cookie is present, otherwise opens the popup.
     *
     * @returns {void}
     */
    CookieConsent.prototype.load = function ()
    {
        //# Already setted
        if(this.cookie.get(this.data.settings.name)) {
            return;
        }

        this.start();
    };

    /**
     * Chargement du contenu principal
     *
     * @returns {object} jQuery overlay element
     */
    CookieConsent.prototype.overlay = function ()
    {
        var $overlay = $('#'+ this.options.popup);
        if(!$overlay.length) {
            $overlay = $('<div data-nosnippet id="' + this.options.popup + '" data-lang="' + this.data.settings.lang + '" tabindex="-1" role="dialog" aria-label="' + this.data.popup.title.replace('"', '“') + '"></div>');
            $('body').append($overlay);
        }

        if(!$overlay.hasClass('show')) {
            setTimeout(function () {
                $overlay.addClass('show');
                $('body').addClass(this.options.body_popup);
            }.bind(this), 1000);
        }

        return $overlay;
    };

    /**
     * Popup main content
     *
     * @returns {void}
     */
    CookieConsent.prototype.start = function ()
    {
        var $overlay = this.overlay();
        var $card = $overlay.find('.ccard[data-service="cookies"]');
        if($card.length) {
            $overlay.find('.ccard').hide();
            $card.fadeIn();
            return;
        }

        //# Prépare les données de la popup
        $card = $(
            '<div class="ccard" data-service="cookies">' +
                '<div class="ccard-header">' +
                    '<div data-nosnippet class="ccard-title">' + this.data.popup.title + '</div>' +
                '</div>' +
                '<div class="ccard-body">' +
                    '<div data-nosnippet class="ccard-content">' +
                        this.data.popup.description +
                    '</div>' +
                '</div>' +
                '<div class="ccard-footer">' +
                    '<button data-nosnippet class="btn btn-cookieconsent-decline">' + this.data.popup.btn_decline + '</button>' +
                    '<button data-nosnippet class="btn btn-cookieconsent-configure">' + this.data.popup.btn_configure + '</button>' +
                    '<button data-nosnippet class="btn btn-cookieconsent-accept">' + this.data.popup.btn_accept + '</button>' +
                '</div>' +
            '</div>'
        );

        //# Ajout des fonctionnalités
        $card.find('.btn-cookieconsent-accept').click(function (event) {
            event.preventDefault();
            event.stopPropagation();
            this.accept();
        }.bind(this));
        $card.find('.btn-cookieconsent-decline').click(function (event) {
            event.preventDefault();
            event.stopPropagation();
            this.decline();
        }.bind(this));
        $card.find('.btn-cookieconsent-configure').click(function (event) {
            event.preventDefault();
            event.stopPropagation();
            this.configure();
        }.bind(this));

        //# Affichage
        $overlay.append($card);
        $overlay.find('.ccard').hide();
        $card.fadeIn();
    };

    /**
     * Affichage du détail des cookies à sélectionner
     *
     * @returns {void}
     */
    CookieConsent.prototype.configure = function ()
    {
        var $overlay = this.overlay();
        var $card = $overlay.find('.ccard[data-service="cookies-configure"]');
        if($card.length) {
            $overlay.find('.ccard').hide();
            $card.fadeIn();
            return;
        }

        //# Préparation du formulaire
        var form = ''; var disabled, checked = false;
        for (var key in this.data.configure.options) {
            disabled = this.data.configure.options[key].disabled || false;
            checked = this.data.configure.options[key].checked || false;
            form +=
                '<label' + (disabled ? ' class="disabled"' : '') + '>' +
                    '<div class="options-label">' +
                        '<div data-nosnippet class="options-title">' + this.data.configure.options[key].title + '</div>' +
                        '<div data-nosnippet class="options-description">' + this.data.configure.options[key].description + '</div>' +
                    '</div>' +
                    '<div class="options-input">' +
                        '<div class="swicheckbox">' +
                            '<input ' + (disabled ? 'disabled checked ' : '') + (!disabled && checked ? 'checked ' : '') + 'type="checkbox" value="'+ this.data.configure.options[key].id +'">' +
                            '<span class="slider' + (disabled ? ' disabled' : '') + '"></span>' +
                        '</div>' +
                    '</div>' +
                '</label>';
        }

        //# Prépare les données de l'overlay
        $card = $(
            '<div class="ccard" data-service="cookies-configure">' +
                '<div class="ccard-header">' +
                    '<div data-nosnippet class="ccard-title">' + this.data.configure.title + '</div>' +
                '</div>' +
                '<div class="ccard-body">' +
                    '<div data-nosnippet class="ccard-content">' +
                        '<p data-nosnippet>' + this.data.configure.description + '</p>' +
                        '<div class="options-tab">' +
                            '<form>' + form + '</form>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="ccard-footer">' +
                    '<button data-nosnippet class="btn btn-cookieconsent-back">' + this.data.configure.btn_back + '</button>' +
                    '<button data-nosnippet class="btn btn-cookieconsent-save">' + this.data.configure.btn_save + '</button>' +
                '</div>' +
            '</div>'
        );

        //# Ajout des fonctionnalités
        $card.find('.btn-cookieconsent-back').click(function (event) {
            event.preventDefault();
            event.stopPropagation();
            this.start();
        }.bind(this));
        $card.find('.btn-cookieconsent-save').click(function (event) {
            event.preventDefault();
            event.stopPropagation();
            this.save($card.find('form'));
        }.bind(this));

        //# Smart affichage
        $overlay.append($card);
        $overlay.find('.ccard').hide();
        $card.fadeIn();
    };

    /**
     * Accept all cookies
     *
     * @returns {void}
     */
    CookieConsent.prototype.close = function ()
    {
        var $Popup = $('#'+ this.options.popup);
        if($Popup.length) {
            $Popup.removeClass('show');
            $('body').removeClass(this.options.body_popup);
            setTimeout(function () {
                $Popup.remove();
            }, 2500);
        }

        if(this.options.reload) {
            setTimeout(function () {
                window.location.reload();
            }, 1000);
        }
    };

    /**
     * Accept all cookies
     *
     * @returns {void}
     */
    CookieConsent.prototype.accept = function ()
    {
        this.cookie.set(this.data.settings.name, this.data.settings.accept, { expires: this.data.settings.accept_duration });
        this.close();
    };

    /**
     * Decline all cookies
     *
     * @returns {void}
     */
    CookieConsent.prototype.decline = function ()
    {
        this.cookie.set(this.data.settings.name, this.data.settings.decline, { expires: this.data.settings.decline_duration });
        this.close();
    };

    /**
     * Accept all cookies
     *
     * @returns {void}
     */
    CookieConsent.prototype.save = function ($form)
    {
        var vals = '';
        $form.find('input:checked').each(function () {
            vals += (vals ? ';' : '') + this.value;
        });

        if(!vals) {
            this.decline();
            return;
        }

        this.cookie.set(this.data.settings.name, vals, { expires: this.data.settings.configure_duration });
        this.close();
    };

    /**
     * Defaults properties
     *
     * @type {{popup: string, body_popup: string, reload: boolean}}
     */
    CookieConsent.prototype.defaults = {
        popup: 'CookieConsentPopup',
        body_popup: 'CookieConsentPopupOpened',
        reload: false,
    };

    /**
     * Global external access
     *
     * @type {CookieConsent}
     */
    window.CookieConsent = CookieConsent;

})})(jQuery);