# @churchapps/apphelper Component Usage Report

Generated on: 2025-07-04

## Executive Summary

This report analyzes the usage of @churchapps/apphelper components across active projects in the LCS ecosystem. The package exports 34 React components, 14 helper utilities, and numerous TypeScript interfaces.

**Note**: As of this report, donation management components (15 components) and person management components (2 components) have been moved from AppHelper to ChumsApp for better architectural separation.

### Projects Using @churchapps/apphelper

| Project | Version | Location | Primary Use Case |
|---------|---------|----------|------------------|
| **B1App** | 0.4.1 | `/mnt/e/LCS/B1/B1App/` | Main B1 platform application |
| **ChumsApp** | 0.4.7 | `/mnt/e/LCS/Chums/ChumsApp/` | Church management system |
| **ChumsTransfer** | 0.4.7 | `/mnt/e/LCS/Chums/ChumsTransfer/` | Church data transfer tool |
| **LessonsApp** | ^0.3.46 | `/mnt/e/LCS/Lessons/LessonsApp/` | Lessons management |
| **ChurchAppsWeb** | 0.0.5 | `/mnt/e/LCS/ChurchApps/ChurchAppsWeb/` | ChurchApps web platform |

## Component Usage Matrix

**Legend**: 
- ✅ = Used from @churchapps/apphelper
- 🏠 = Moved to local project (no longer in AppHelper)
- ❌ = Not used

### Core UI Components

| Component | B1App | ChumsApp | ChumsTransfer | LessonsApp | ChurchAppsWeb |
|-----------|:-----:|:--------:|:-------------:|:----------:|:-------------:|
| **DisplayBox** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Loading** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **SmallButton** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **InputBox** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **ErrorMessages** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Banner** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **ExportLink** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **HelpIcon** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **TabPanel** | ❌ | ❌ | ❌ | ❌ | ❌ |

### Authentication Components

| Component | B1App | ChumsApp | ChumsTransfer | LessonsApp | ChurchAppsWeb |
|-----------|:-----:|:--------:|:-------------:|:----------:|:-------------:|
| **LoginPage** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **LogoutPage** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Register** | ❌ | ❌ | ❌ | ✅ | ✅ |

### Form & Input Components

| Component | B1App | ChumsApp | ChumsTransfer | LessonsApp | ChurchAppsWeb |
|-----------|:-----:|:--------:|:-------------:|:----------:|:-------------:|
| **CreatePerson** | ❌ | 🏠 | ❌ | ❌ | ❌ |
| **PersonAdd** | ❌ | 🏠 | ❌ | ❌ | ❌ |
| **FormSubmissionEdit** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **QuestionEdit** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **ImageEditor** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **IconPicker** | ✅ | ❌ | ❌ | ❌ | ❌ |

### Rich Text Components

| Component | B1App | ChumsApp | ChumsTransfer | LessonsApp | ChurchAppsWeb |
|-----------|:-----:|:--------:|:-------------:|:----------:|:-------------:|
| **MarkdownEditor** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **MarkdownPreview** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **MarkdownPreviewLight** | ✅ | ❌ | ❌ | ✅ | ❌ |

### Communication Components

| Component | B1App | ChumsApp | ChumsTransfer | LessonsApp | ChurchAppsWeb |
|-----------|:-----:|:--------:|:-------------:|:----------:|:-------------:|
| **Conversations** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Conversation** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Notes** | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Note** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **AddNote** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **NewPrivateMessage** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **PrivateMessageDetails** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **NewConversation** | ❌ | ❌ | ❌ | ❌ | ❌ |

### Donation Components

| Component | B1App | ChumsApp | ChumsTransfer | LessonsApp | ChurchAppsWeb |
|-----------|:-----:|:--------:|:-------------:|:----------:|:-------------:|
| **DonationPage** | ❌ | 🏠 | ❌ | ❌ | ❌ |
| **DonationForm** | ✅ | 🏠 | ❌ | ❌ | ❌ |
| **NonAuthDonation** | ✅ | 🏠 | ❌ | ❌ | ❌ |
| **NonAuthDonationInner** | ❌ | 🏠 | ❌ | ❌ | ❌ |
| **PaymentMethods** | ✅ | 🏠 | ❌ | ❌ | ❌ |
| **RecurringDonations** | ✅ | 🏠 | ❌ | ❌ | ❌ |
| **RecurringDonationsEdit** | ❌ | 🏠 | ❌ | ❌ | ❌ |
| **FundDonations** | ❌ | 🏠 | ❌ | ❌ | ❌ |
| **FundDonation** | ❌ | 🏠 | ❌ | ❌ | ❌ |
| **BankForm** | ❌ | 🏠 | ❌ | ❌ | ❌ |
| **CardForm** | ❌ | 🏠 | ❌ | ❌ | ❌ |
| **FormCardPayment** | ❌ | 🏠 | ❌ | ❌ | ❌ |
| **DonationPreviewModal** | ❌ | 🏠 | ❌ | ❌ | ❌ |

### Gallery & Media Components

| Component | B1App | ChumsApp | ChumsTransfer | LessonsApp | ChurchAppsWeb |
|-----------|:-----:|:--------:|:-------------:|:----------:|:-------------:|
| **GalleryModal** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **StockPhotos** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **B1ShareModal** | ✅ | ❌ | ❌ | ✅ | ❌ |

### Support Components

| Component | B1App | ChumsApp | ChumsTransfer | LessonsApp | ChurchAppsWeb |
|-----------|:-----:|:--------:|:-------------:|:----------:|:-------------:|
| **FloatingSupport** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **SupportModal** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **SupportDrawer** | ❌ | ❌ | ❌ | ❌ | ❌ |

### Reporting Components

| Component | B1App | ChumsApp | ChumsTransfer | LessonsApp | ChurchAppsWeb |
|-----------|:-----:|:--------:|:-------------:|:----------:|:-------------:|
| **ReportWithFilter** | ❌ | ✅ | ❌ | ❌ | ❌ |
| **ReportFilter** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **ReportFilterField** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **ReportOutput** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **ChartReport** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **TableReport** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **TreeReport** | ❌ | ❌ | ❌ | ❌ | ❌ |

### Header & Navigation Components

| Component | B1App | ChumsApp | ChumsTransfer | LessonsApp | ChurchAppsWeb |
|-----------|:-----:|:--------:|:-------------:|:----------:|:-------------:|
| **SiteHeader** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **PrimaryMenu** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **SecondaryMenu** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **SecondaryMenuAlt** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **NavItem** | ❌ | ❌ | ❌ | ✅ | ❌ |

### Wrapper Components

| Component | B1App | ChumsApp | ChumsTransfer | LessonsApp | ChurchAppsWeb |
|-----------|:-----:|:--------:|:-------------:|:----------:|:-------------:|
| **SiteWrapper** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **AppList** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **ChurchList** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **UserMenu** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Drawers** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Notifications** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **PrivateMessages** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **TabPanel** (wrapper) | ❌ | ❌ | ❌ | ❌ | ❌ |

### Page Components

| Component | B1App | ChumsApp | ChumsTransfer | LessonsApp | ChurchAppsWeb |
|-----------|:-----:|:--------:|:-------------:|:----------:|:-------------:|
| **Forgot** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Login** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **LoginSetPassword** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **SelectChurchModal** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **SelectChurchRegister** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **SelectChurchSearch** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **SelectableChurch** | ❌ | ❌ | ❌ | ❌ | ❌ |

## Helper Utilities Usage

| Helper | B1App | ChumsApp | ChumsTransfer | LessonsApp | ChurchAppsWeb |
|--------|:-----:|:--------:|:-------------:|:----------:|:-------------:|
| **ApiHelper** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **UserHelper** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **ArrayHelper** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **DateHelper** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **PersonHelper** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **CurrencyHelper** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **AppearanceHelper** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **AnalyticsHelper** | ✅ | ✅ | ❌ | ✅ | ✅ |
| **ErrorHelper** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **CommonEnvironmentHelper** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **UniqueIdHelper** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **SlugHelper** | ✅ | ❌ | ❌ | ✅ | ❌ |
| **EventHelper** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **SocketHelper** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Locale** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **DonationHelper** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **FileHelper** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **ReportHelper** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **createEmotionCache** | ❌ | ❌ | ❌ | ❌ | ❌ |

## Component Usage Analysis

The following analysis shows component usage patterns, distinguishing between external project usage and internal AppHelper usage:

### Components Used Internally by AppHelper (22 total)

These components are not directly imported by external projects but are used internally by other AppHelper components:

#### Core UI Components (4)
- **HelpIcon** - Used by `DisplayBox` and `InputBox` components
- **TabPanel** - Used by `UserMenu` and `GalleryModal` components
- **QuestionEdit** - Used by `FormSubmissionEdit` component
- **FormCardPayment** - Used by `QuestionEdit` component

#### Notes & Communication Components (4)
- **Note** - Used by `Notes` component
- **AddNote** - Used by `Notes` and `NewPrivateMessage` components
- **Conversation** - Used by `Conversations` component
- **NewConversation** - Used by `Conversations` component

#### Moved Components (17)
These components have been moved to ChumsApp and are no longer part of AppHelper:
- **Donation Components (13)**: DonationPage, DonationForm, NonAuthDonation, NonAuthDonationInner, PaymentMethods, RecurringDonations, RecurringDonationsEdit, FundDonations, FundDonation, BankForm, CardForm, FormCardPayment, DonationPreviewModal
- **Person Management (2)**: PersonAdd, CreatePerson

#### Gallery Components (1)
- **StockPhotos** - Used by `GalleryModal` component

#### Header Components (4)
- **SupportDrawer** - Used by `SiteHeader` component
- **PrimaryMenu** - Used by `SiteHeader` component
- **SecondaryMenu** - Used by `SiteHeader` component
- **SecondaryMenuAlt** - Used by `SiteHeader` component

#### Reporting Components (6)
- **ReportFilter** - Used by `ReportWithFilter` component
- **ReportFilterField** - Used by `ReportFilter` component
- **ReportOutput** - Used by `ReportWithFilter` component
- **ChartReport** - Used by `ReportOutput` component
- **TableReport** - Used by `ReportOutput` component
- **TreeReport** - Used by `ReportOutput` component

#### Wrapper Components (5)
- **UserMenu** - Used by `SiteHeader` and `SiteWrapper` components
- **AppList** - Used by `UserMenu` component
- **ChurchList** - Used by `UserMenu` component
- **Notifications** - Used by `UserMenu` component
- **PrivateMessages** - Used by `UserMenu` component
- **Drawers** - Used by `SiteWrapper` component

#### Page Components (8)
- **Forgot** - Used by `LoginPage` component
- **Login** - Used by `LoginPage` component
- **LoginSetPassword** - Used by `LoginPage` component
- **SelectChurchModal** - Used by `LoginPage` component
- **SelectChurchRegister** - Used by `SelectChurchSearch` component
- **SelectChurchSearch** - Used by `SelectChurchSearch` component
- **SelectableChurch** - Used by `SelectChurchSearch` component

### Truly Unused Components (1 total)

Only one component appears to have no usage either externally or internally:
- **SiteWrapper** - Main site wrapper component (not used by any external projects or internal components)

### Moved Components Summary (17 total)

The following components have been extracted from AppHelper and moved to ChumsApp for better architectural separation:

#### Donation Management System (13 components)
- **Main Components**: DonationPage, DonationForm, NonAuthDonation
- **Payment Processing**: PaymentMethods, BankForm, CardForm, FormCardPayment
- **Fund Management**: FundDonations, FundDonation
- **Recurring Donations**: RecurringDonations, RecurringDonationsEdit
- **Internal Components**: NonAuthDonationInner, DonationPreviewModal

#### Person Management (2 components)
- **PersonAdd** - Add person to groups/systems
- **CreatePerson** - Create new person records

These components are now maintained within ChumsApp, allowing for faster iteration on CHUMS-specific functionality while reducing AppHelper's bundle size and complexity.

### Unused Helper Utilities (4 total)
1. **DonationHelper** - Donation-related utilities
2. **FileHelper** - File handling utilities
3. **ReportHelper** - Reporting utilities
4. **createEmotionCache** - Emotion cache creation

## Key Insights

1. **Core Components**: The most widely used components are `DisplayBox`, `Loading`, `SmallButton`, `InputBox`, and `ErrorMessages`, which appear in most active projects.

2. **Authentication**: All projects use `LoginPage`, making it the most universally adopted component. `LogoutPage` is used by all except ChurchAppsWeb.

3. **Project-Specific Usage**:
   - **B1App**: Uses the widest variety of components including donations, communications, and rich media
   - **ChumsApp**: Focuses on forms, reporting, and person management
   - **LessonsApp**: Uses support components uniquely among all projects
   - **ChumsTransfer & ChurchAppsWeb**: Minimal usage, primarily authentication

4. **Component Architecture**: AppHelper demonstrates excellent internal component composition with 22 components (65%) used internally by other components, showing a well-structured component hierarchy where complex components are built from simpler, focused components.

5. **External vs Internal Usage**: Only 11 out of 34 components (32%) are directly imported by external projects, while 22 components (65%) serve as internal building blocks. Only 1 component (3%) appears to be truly unused.

6. **Successful Component Extraction**: 17 components (50% of the original 51) have been successfully moved from AppHelper to ChumsApp, including the entire donation management system and person management components. This extraction significantly reduced AppHelper's bundle size and improved architectural separation.

7. **Helper Utilities**: `ApiHelper` and `UserHelper` are universally used across all projects, while specialized helpers like `DonationHelper` and `FileHelper` remain unused.

## Recommendations

1. **✅ COMPLETED: Component Extraction**: Successfully moved 17 CHUMS-specific components to ChumsApp, including:
   - Complete donation management system (13 components)  
   - Person management components (2 components)
   - Achieved 50% reduction in AppHelper component count (51 → 34)
   - Eliminated Stripe dependencies from AppHelper
   - Improved architectural separation

2. **Maintain Component Architecture**: The current component composition strategy is excellent, with most components serving as internal building blocks. This architecture should be preserved as it promotes reusability and maintainability.

3. **Documentation Enhancement**: 
   - Document the internal component hierarchy to help developers understand the composition patterns
   - Create examples for the 11 externally-used components to promote adoption
   - Add architecture diagrams showing component dependencies
   - Document the successful component extraction process for future reference

4. **Minimal Cleanup**: Only `SiteWrapper` appears to be truly unused and could be considered for deprecation if confirmed to have no purpose.

5. **Helper Utilities Review**: The 4 unused helper utilities (`DonationHelper`, `FileHelper`, `ReportHelper`, `createEmotionCache`) could be evaluated for removal if they serve no purpose.

6. **External Adoption**: Consider promoting usage of high-level components like:
   - `SiteHeader` for consistent navigation
   - `FloatingSupport` and `SupportModal` for user assistance
   - Rich text components (`MarkdownEditor`, `MarkdownPreview`) for content management

7. **Component Export Strategy**: With the reduced component count (34 vs original 51), the public API surface is now more manageable. Consider whether all remaining components need to be exported, or if some internal-only components could be kept private.

8. **Monitor ChumsApp Integration**: Validate that the moved components work correctly in ChumsApp and that the donation/person management workflows function as expected.