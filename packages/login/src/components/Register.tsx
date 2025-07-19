"use client";

import React, { FormEventHandler } from "react";
import { LoginResponseInterface, RegisterUserInterface, UserInterface } from "@churchapps/helpers";
import { ApiHelper } from "@churchapps/helpers";
import { AnalyticsHelper, Locale } from "../helpers";
import { TextField, Card, CardContent, Typography, Button } from "@mui/material";

interface Props {
  appName?: string,
  appUrl?: string,
  updateErrors: (errors: string[]) => void,
  loginCallback?: () => void
  userRegisteredCallback?: (user: UserInterface) => Promise<void>;
}

export const Register: React.FC<Props> = (props) => {

  const cleanAppUrl = () => {
    if (!props.appUrl) return null;
    else {
      const index = props.appUrl.indexOf("/", 9);
      if (index === -1) return props.appUrl;
      else return props.appUrl.substring(0, index);
    }
  }

  const [registered, setRegistered] = React.useState(false);
  const [user, setUser] = React.useState<RegisterUserInterface>({ firstName: "", lastName: "", email: "", appName: props.appName, appUrl: cleanAppUrl() });
  const [errors, setErrors] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleRegisterErrors = (errors: string[]) => {
    props.updateErrors(errors)
  }

  const handleRegisterSuccess = (resp: LoginResponseInterface) => {
    setRegistered(true);
    AnalyticsHelper.logEvent("User", "Register");
    if (props.userRegisteredCallback) props.userRegisteredCallback(resp.user);
  }

  const validateEmail = (email: string) => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const u = { ...user }
    switch (e.target.name) {
      case "firstName": u.firstName = e.target.value; break;
      case "lastName": u.lastName = e.target.value; break;
      case "email": u.email = e.target.value; break;
    }
    setUser(u);
  }

  const validate = () => {
    let errors = [];
    if (!user.email?.trim()) errors.push(Locale.label("login.validate.email"));
    else if (!validateEmail(user.email)) errors.push(Locale.label("login.validate.email"));
    if (!user.firstName?.trim()) errors.push(Locale.label("login.validate.firstName"));
    if (!user.lastName?.trim()) errors.push(Locale.label("login.validate.lastName"));
    setErrors(errors);
    return errors.length === 0;
  }

  const register: FormEventHandler = (e) => {
    e.preventDefault();
    props.updateErrors([])
    if (validate()) {
      setIsSubmitting(true);
      ApiHelper.postAnonymous("/users/register", user, "MembershipApi")
        .then((resp: any) => {
          if (resp.errors) handleRegisterErrors(resp.errors);
          else handleRegisterSuccess(resp);
        })
        .catch((e) => { props.updateErrors([e.toString()]); throw e; })
        .finally(() => {
          setIsSubmitting(false)
        });
    }
  };

  if (registered) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <Card sx={{ 
          width: '100%', 
          maxWidth: { xs: '400px', sm: '500px' },
          backgroundColor: 'white', 
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}>
          <CardContent sx={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ marginBottom: '32px' }}>
              <img 
                src="/images/logo-login.png" 
                alt="Church Logo" 
                style={{ 
                  maxWidth: '100%', 
                  width: 'auto',
                  height: 'auto',
                  maxHeight: '80px', 
                  marginBottom: '16px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <Typography 
              component="h1" 
              sx={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#111827',
                marginBottom: '32px'
              }}
            >
              Registration Complete
            </Typography>
            <Typography sx={{ color: '#6b7280', marginBottom: '24px' }}>
              {Locale.label("login.registerThankYou")}
            </Typography>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); props.loginCallback && props.loginCallback(); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              Back to sign in
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <Card sx={{ 
        width: '100%', 
        maxWidth: { xs: '400px', sm: '500px' },
        backgroundColor: 'white', 
        border: '1px solid #e5e7eb',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}>
        <CardContent sx={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ marginBottom: '32px' }}>
            <img 
              src="/images/logo-login.png" 
              alt="Church Logo" 
              style={{ 
                maxWidth: '100%', 
                width: 'auto',
                height: 'auto',
                maxHeight: '80px', 
                marginBottom: '16px',
                objectFit: 'contain'
              }}
            />
          </div>
          <Typography 
            component="h1" 
            sx={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#111827',
              marginBottom: '8px'
            }}
          >
            Create Account
          </Typography>
          <Typography 
            sx={{ 
              color: '#6b7280',
              marginBottom: '32px'
            }}
          >
            Create a new account to access your church
          </Typography>

          <form onSubmit={register} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {errors.length > 0 && (
              <div style={{ 
                backgroundColor: '#fef2f2', 
                border: '1px solid #fecaca', 
                borderRadius: '6px', 
                padding: '12px',
                textAlign: 'left'
              }}>
                {errors.map((error, index) => (
                  <div key={index} style={{ color: '#dc2626', fontSize: '14px' }}>{error}</div>
                ))}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="firstName" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', textAlign: 'left' }}>
                  First Name
                </label>
                <TextField
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={user.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                  variant="outlined"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '& fieldset': { 
                        borderColor: '#d1d5db' 
                      },
                      '&:hover fieldset': { 
                        borderColor: '#d1d5db' 
                      },
                      '&.Mui-focused fieldset': { 
                        borderColor: '#3b82f6' 
                      },
                      '& input': { 
                        color: '#111827',
                        fontSize: '16px'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      display: 'none'
                    }
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="lastName" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', textAlign: 'left' }}>
                  Last Name
                </label>
                <TextField
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={user.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                  variant="outlined"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '& fieldset': { 
                        borderColor: '#d1d5db' 
                      },
                      '&:hover fieldset': { 
                        borderColor: '#d1d5db' 
                      },
                      '&.Mui-focused fieldset': { 
                        borderColor: '#3b82f6' 
                      },
                      '& input': { 
                        color: '#111827',
                        fontSize: '16px'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      display: 'none'
                    }
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="email" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', textAlign: 'left' }}>
                Email
              </label>
              <TextField
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={handleChange}
                required
                autoComplete="email"
                variant="outlined"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '& fieldset': { 
                      borderColor: '#d1d5db' 
                    },
                    '&:hover fieldset': { 
                      borderColor: '#d1d5db' 
                    },
                    '&.Mui-focused fieldset': { 
                      borderColor: '#3b82f6' 
                    },
                    '& input': { 
                      color: '#111827',
                      fontSize: '16px'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    display: 'none'
                  }
                }}
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              sx={{
                backgroundColor: 'hsl(218, 85%, 55%)',
                color: 'white',
                padding: '12px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 500,
                borderRadius: '6px',
                '&:hover': { 
                  backgroundColor: 'hsl(218, 85%, 50%)' 
                },
                '&:disabled': { 
                  backgroundColor: '#9ca3af' 
                }
              }}
            >
              {isSubmitting ? "Please wait..." : "Register"}
            </Button>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); props.loginCallback && props.loginCallback(); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#3b82f6',
                    fontSize: '14px',
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  Sign in
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};