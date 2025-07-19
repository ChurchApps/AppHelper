# AppHelper Component Playground

A comprehensive testing environment for all exported components from `@churchapps/apphelper`.

## Available Components

### Login Components (@churchapps/apphelper-login)
- LoginPage (complete login flow)
- Login (form component)
- Register (registration form)
- Forgot (password recovery)
- LoginSetPassword (password reset)
- SelectChurchRegister (church registration)
- SelectChurchSearch (church search)

### Core UI Components (@churchapps/apphelper)
- ErrorMessages (error display)
- DisplayBox (content container)
- InputBox (enhanced input)
- Loading (spinner)
- SmallButton (compact button)
- HelpIcon (tooltip icon)
- ExportLink (data export)
- FloatingSupport (support widget)
- SupportModal (help modal)
- Notes (notes management)
- QuestionEdit (form question editor)
- FormSubmissionEdit (form editor)
- ImageEditor (image upload/edit)

### Markdown Components (@churchapps/apphelper-markdown)
- MarkdownEditor (rich text editor with toolbar)
- MarkdownPreview (full markdown preview)
- MarkdownPreviewLight (lightweight preview)

### Wrapper Components (@churchapps/apphelper)
- SiteWrapper (main app shell)
- NavItem (navigation item)
- AppList (app selection)
- ChurchList (church selection)
- UserMenu (user menu)
- NewPrivateMessage (message composition)
- PrivateMessageDetails (message display)

### Donation Components (@churchapps/apphelper-donations)
- DonationForm (main donation form)
- FundDonation (fund-specific donation)
- FundDonations (multi-fund donations)
- NonAuthDonation (guest donations)
- NonAuthDonationInner (guest donation inner)
- CardForm (credit card form)
- BankForm (bank account form)
- PaymentMethods (payment method management)
- RecurringDonations (recurring donation display)
- RecurringDonationsEdit (recurring donation editor)
- DonationPreviewModal (donation preview)

### Reporting Components (@churchapps/apphelper)
- ReportFilter (filter component)
- ReportFilterField (individual filter field)
- ReportOutput (report display)
- ReportWithFilter (combined report with filters)

### Header Components (@churchapps/apphelper)
- Banner (church banner)
- SiteHeader (main site header)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file with your configuration:**
   ```env
   # Required for donation components
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   VITE_CHURCH_ID=your_church_id
   VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Environment Variables

### Required for Donation Components

- **VITE_STRIPE_PUBLISHABLE_KEY**: Your Stripe publishable key
  - Get from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
  - Use test keys (pk_test_...) for development
  - Never use live keys in development!

- **VITE_CHURCH_ID**: Church identifier for testing
  - Used by donation components to fetch configuration
  - Can be any string for testing purposes

- **VITE_RECAPTCHA_SITE_KEY**: reCAPTCHA site key
  - Required for non-authenticated donations
  - Get from [Google reCAPTCHA](https://www.google.com/recaptcha/admin)

### Optional API Overrides

- **VITE_GIVING_API_URL**: Override default Giving API endpoint
- **VITE_MEMBERSHIP_API_URL**: Override default Membership API endpoint
- **VITE_ACCESS_API_URL**: Override default Access API endpoint

## Usage

1. **Start the playground:**
   ```bash
   npm run dev
   ```

2. **Navigate to different component groups:**
   - Visit the home page to see all available component categories
   - Click on any category to test those specific components
   - Each component page verifies import availability and shows component information

3. **Testing components:**
   - Each test page shows successfully imported components
   - Components are wrapped in error boundaries for safe testing
   - Pages show component types and package sources

## Testing Stripe Integration

### Test Cards
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

### Test Bank Account
- **Routing**: 110000000
- **Account**: 000123456789

### Important Notes
- Always use test keys (pk_test_...) in development
- Never commit real API keys to version control
- Test thoroughly before using live keys

## Development

- The playground uses Vite for fast development
- All components are imported from `@churchapps/apphelper`
- TypeScript is fully supported
- Material-UI theming is pre-configured
- Environment variables are loaded via Vite (VITE_ prefix)

## Notes

- Some components require API connections that will gracefully fail in demo mode
- Donation components now support environment-based Stripe configuration
- All components are documented with usage examples and sample data
- The playground is designed to test component behavior and integration

## File Structure

```
playground/
├── src/
│   ├── pages/           # Component test pages
│   ├── App.tsx          # Main application with routing
│   ├── UserContext.tsx  # User context provider
│   └── ErrorBoundary.tsx # Error boundary component
├── package.json         # Dependencies and scripts
└── README.md           # This file
```