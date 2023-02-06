export const SignInFormFields = [
  {
    name    : "email_address",
    label   : "Email address",
    type    : "email",
    required: true,
    errorMessages: {
      required: "Please provide an email address",
      email   : "Please enter a valid email address"
    }
  },
  {
    name    : "password",
    label   : "Password",
    type    : "password",
    required: true,
    errorMessages: {
      required: "Please provide a password"
    }
  },
  {
    name : "submit",
    label: "Login",
    type : "submit",
  },
  {
    name: "terms",
    label: "",
    type : "markup",
    value: "<small><a href=\"/user/password-reset\" >Forgot Password?</a></small>"
  }
]

export const SignUpFormFields = [
  {
    name         : "first_name",
    label        : "First name",
    type         : "text",
    required     : true,
    errorMessages: {
      required: "Please provide your first name"
    }
  },
  {
    name    : "last_name",
    label   : "Last name",
    type    : "text",
    required: true,
    errorMessages: {
      required: "Please provide your last name"
    }
  },
  {
    name    : "email_address",
    label   : "Email address",
    type    : "email",
    required: true,
    errorMessages: {
      required: "Please provide an email address",
      email   : "Please enter a valid email address"
    }
  },
  {
    name : "submit",
    label: "Creat your account",
    type : "submit",
  },
  {
    name: "terms",
    label: "",
    type : "markup",
    value: "<small>By creating an account you agree to the <a href=\"#\" >Terms of use</a></small>"
  }
]

export const VerificationFormFields = [
  {
    type  : "welcome",
    shouldSubmit: false,
    data: {
      message: "Welcome! Let’s get started",
      image: {
        small: {
          src: "/images/welcome-screen-image--mobile.jpg",
          alt: "Image of exercise map"
        },
        medium: {
          src: "/images/welcome-screen-image--medium.jpg",
          alt: "Image of exercise map"
        },
        large: {
          src: "/images/welcome-screen-image--desktop.jpg",
          alt: "Image of exercise map"
        }
      }
    }
  },
  {
    type : "form",
    shouldSubmit: false,
    title: "Set you password",
    fields: [
      {
        name    : "password",
        label   : "Password",
        type    : "password",
        required: true,
        errorMessages: {
          required: "Please provide a password"
        }
      },
      {
        name         : "password_confirm",
        label        : "Confirm password",
        type         : "password",
        required     : true,
        equals       : "password",
        errorMessages: {
          required: "Please confirm your password",
          equals  : "Please check your password"
        }
      },
      {
        name : "submit",
        label: "Next",
        type : "submit",
      }
    ]

  },
  {
    type : "form",
    title: "Set your goal",
    shouldSubmit: true,
    fields: [
      {
        name    : "goal",
        label   : "What’s your primary goal?",
        type    : "radios",
        options : [
          {value: "manage",     label: "Manage my back pain"},
          {value: "recover",    label: "Recover from my injury"},
          {value: "strength",   label: "Build my strength"},
          {value: "specialist", label: "Find a specialist"},
        ],
        required: true,
        errorMessages: {
          required: "Please select a goal"
        }
      },
      {
        name : "submit",
        label: "Finish",
        type : "submit",
      },
    ]
  },
  {
    shouldSubmit: false,
    type  : "install_prompt"
  },
]

export const PasswordResetFields = [
  {
    name: "email_address",
    label: "Email address",
    type: "email",
    required: true,
    errorMessages: {
      required: "Please provide an email address",
      email: "Please enter a valid email address"
    },
  },
  {
    name : "submit",
    label: "Reset",
    type : "submit",
  }
]