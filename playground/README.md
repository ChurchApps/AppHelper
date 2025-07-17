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

## Development

- The playground uses Vite for fast development
- All components are imported from `@churchapps/apphelper`
- TypeScript is fully supported
- Material-UI theming is pre-configured

## Notes

- Some components require API connections that will gracefully fail in demo mode
- Stripe components use mock data for testing
- All components are documented with usage examples and sample data
- The playground is designed to test component behavior, not actual functionality

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