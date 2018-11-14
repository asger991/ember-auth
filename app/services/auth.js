import Service from '@ember/service';
import { computed } from '@ember/object';
import config from 'ember-auth/config/environment';

export default Service.extend({

    auth0: computed(function () {
        return new auth0.WebAuth({
          domain: 'cgi-test.eu.auth0.com',
          clientID: 'VeZYT13RqC7hYZQyzvB3983yRN4AoVsr',
          redirectUri: 'http://localhost:4200/callback',
          audience: `https://${config.auth0.domain}/userinfo`,
          responseType: 'token',
          scope: 'openid profile'
        });
      }),

      login() {
        this.get('auth0').authorize();
      },

      handleAuthentication() {
        return new Promise((resolve) => {
          this.get('auth0').parseHash((err, authResult) => {
            if (err) return false;
    
            if (authResult && authResult.accessToken) {
              this.setUser(authResult.accessToken);
            }
    
            return resolve();
          });
        });
      },

      isAuthenticated: computed(function() {    
        return this.get('checkLogin');
      }),

      setUser(token) {
        this.get('auth0')
          .client
          .userInfo(token, (err, profile) => this.set('user', profile))
      },

      checkLogin() {
        this.get('auth0')
          .checkSession({}, (err, authResult) => {
            if (err) return err;
            this.setUser(authResult.accessToken);
          });
      }, 

      logout() {
        this.get('auth0').logout({
          clientID: config.auth0.clientId,
          returnTo: 'http://localhost:4200'
        });
      }
});
