import API from './API';
import ClientSession from './client-session.js';

const pluralName = 'users';

class User {
  static login = async (username, password) => {
    var data = {
      username: username,
      password: password,
    };

    //member-auth
    return API.createNoToken(`member-login/`, data, null)
      .then((response) => {
        if (response.data.token) {
          ClientSession.storeAuth(response.data, (err) => {});
          return {
            success: true,
            message: 'Logged in successfully',
            user: response.data,
          };
        } else {
          return {
            success: false,
            message: response.data,
          };
        }
      })
      .catch((err) => {
        return {
          success: false,
          data: err.response.data,
          message: err.response.data.non_field_errors
            ? err.response.data.non_field_errors[0]
            : err.response.data[Object.keys(err.response.data)[0]][0],
        };
      });
  };

  static reset = (email) => {
    if (email) {
      return API.create('users/reset', { email: email }).then(
        (response) => {
          return {
            success: true,
            message: 'Email sent Successfully',
            user: response.data,
          };
        },
        (error) => {
          if (error.response) {
            if (error.response.status == 401) {
              // console.log("email sent error");
              return {
                error: true,
                message: 'user email is not found',
              };
            }
            return {
              error: true,
              message: 'Oops error occurred please. Try Again',
            };
          }
          return {
            error: true,
            message: 'Error: Not connected',
          };
        }
      );
    }
  };
  static changePassword = (password, accessToken) => {
    ClientSession.removeAuth();

    if (password) {
      return API.create('users/reset-password' + accessToken, {
        newPassword: password,
      })
        .then(
          (response) => {
            return {
              success: true,
              message: 'Password changed successfully',
              user: response.data,
            };
          },
          (error) => {
            return {
              error: true,
              message: 'Oops error occurred please. Try Again',
            };
          }
        )
        .catch((error) => {
          return {
            error: true,
            message: 'Oops error Occurred please. Try Again',
          };
        });
    }
  };

  static register = (values) => {
    if (values.email && values.username) {
      return API.create(pluralName, values)
        .then(
          (response) => {
            return {
              success: true,
              message:
                'Registered successfully! Check email to confirm account',
              user: response.data,
            };
          },
          (error) => {
            if (error.response) {
              if (error.response.status == 422) {
                return {
                  error: true,
                  message: error.response.data.error.message,
                };
              }
            } else {
              return {
                error: true,
                message: 'Oops error occurred please. Try Again',
              };
            }
          }
        )
        .catch((error) => {
          return {
            error: true,
            message: 'Oops error Occurred please. Try Again',
          };
        });
    }
  };

  static logout = () => {
    ClientSession.getAccessToken(function (isLoggedIn, authData) {
      if (isLoggedIn && authData != null) {
        ClientSession.removeAuth();
      }
    });
  };
}

export default User;
