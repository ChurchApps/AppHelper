import { 
  type PersonInterface, 
  type UserInterface, 
  type LoginUserChurchInterface,
  type UserContextInterface,
  type ChurchInterface
} from "@churchapps/apphelper";

// Mock Person Data
export const mockPerson: PersonInterface = {
  id: "person123",
  name: {
    first: "John",
    last: "Doe",
    middle: "M",
    nick: "Johnny",
    display: "John Doe"
  },
  contactInfo: {
    email: "john.doe@example.com",
    mobilePhone: "555-1234",
    homePhone: "555-5678",
    workPhone: "555-9012", 
    address1: "123 Main St",
    address2: "Apt 4B",
    city: "Anytown",
    state: "ST",
    zip: "12345"
  },
  membershipStatus: "Member",
  gender: "Male",
  birthDate: new Date("1990-01-01"),
  maritalStatus: "Single",
  nametagNotes: "Prefers Johnny",
  householdId: "household123",
  householdRole: "Head",
  photo: "/images/logo-login.png"
};

// Mock User Data
export const mockUser: UserInterface = {
  id: "user123",
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  password: "", // Never store actual passwords
  lastLogin: new Date()
};

// Mock Church Data
export const mockChurch: ChurchInterface = {
  id: "church123",
  name: "Sample Community Church",
  address1: "456 Church Ave",
  address2: "",
  city: "Churchtown",
  state: "ST",
  zip: "12345",
  country: "USA",
  website: "https://samplechurch.org",
  logo: "/images/logo-login.png",
  subDomain: "sample"
};

// Mock User Church Data
export const mockUserChurch: LoginUserChurchInterface = {
  church: mockChurch,
  person: mockPerson,
  permissions: [
    "membershipApi.people.view",
    "membershipApi.people.edit",
    "membershipApi.forms.view",
    "membershipApi.forms.edit",
    "givingApi.donations.view",
    "givingApi.donations.edit",
    "messagingApi.conversations.view",
    "messagingApi.conversations.edit"
  ]
};

// Mock Questions for Forms
export const mockQuestions = [
  {
    id: "q1",
    formId: "form123",
    title: "What is your favorite color?",
    description: "Please select your preferred color",
    fieldType: "Multiple Choice",
    placeholder: "Select a color",
    required: true,
    sort: 1,
    choices: [
      { value: "red", text: "Red" },
      { value: "blue", text: "Blue" },
      { value: "green", text: "Green" }
    ]
  },
  {
    id: "q2", 
    formId: "form123",
    title: "Tell us about yourself",
    description: "Share a brief description",
    fieldType: "Text Area",
    placeholder: "Enter your response here...",
    required: false,
    sort: 2
  },
  {
    id: "q3",
    formId: "form123", 
    title: "Email Address",
    description: "Your contact email",
    fieldType: "Email",
    placeholder: "you@example.com",
    required: true,
    sort: 3
  }
];

// Mock Form Data
export const mockForm = {
  id: "form123",
  churchId: "church123",
  name: "Sample Contact Form",
  description: "A sample form for testing",
  questions: mockQuestions,
  thankYouMessage: "Thank you for your submission!",
  created: new Date("2024-01-01"),
  restrictedAccess: false
};

// Mock Form Submission
export const mockFormSubmission = {
  id: "submission123",
  formId: "form123",
  churchId: "church123",
  person: mockPerson,
  answers: [
    { questionId: "q1", value: "blue" },
    { questionId: "q2", value: "I enjoy hiking and reading books." },
    { questionId: "q3", value: "john.doe@example.com" }
  ],
  created: new Date(),
  updated: new Date()
};

// Mock Donation Data
export const mockDonationFunds = [
  { id: "fund1", name: "General Fund", description: "General church operations" },
  { id: "fund2", name: "Building Fund", description: "Building maintenance and improvements" },
  { id: "fund3", name: "Missions", description: "Missionary support and outreach" }
];

export const mockDonations = [
  {
    id: "donation1",
    personId: "person123",
    amount: 100,
    fundId: "fund1",
    fund: mockDonationFunds[0],
    method: "card",
    recurring: false,
    created: new Date("2024-01-01")
  },
  {
    id: "donation2", 
    personId: "person123",
    amount: 50,
    fundId: "fund3",
    fund: mockDonationFunds[2],
    method: "bank",
    recurring: true,
    interval: "monthly",
    created: new Date("2024-01-15")
  }
];

// Mock Payment Methods
export const mockPaymentMethods = [
  { 
    id: "pm1", 
    type: "card", 
    last4: "4242", 
    brand: "visa", 
    isDefault: true,
    expMonth: 12,
    expYear: 2025 
  },
  { 
    id: "pm2", 
    type: "bank", 
    last4: "1234", 
    bankName: "Sample Bank", 
    isDefault: false 
  }
];

// Mock Churches List
export const mockChurches = [
  mockChurch,
  {
    id: "church456",
    name: "Grace Chapel",
    address1: "789 Grace St",
    address2: "",
    city: "Gracetown",
    state: "ST",
    zip: "54321",
    country: "USA",
    website: "https://gracechapel.org",
    logo: "/images/logo-login.png",
    subDomain: "grace"
  },
  {
    id: "church789",
    name: "First Baptist",
    address1: "321 Baptist Blvd",
    address2: "",
    city: "Baptistville", 
    state: "ST",
    zip: "67890",
    country: "USA",
    website: "https://firstbaptist.org",
    logo: "/images/logo-login.png",
    subDomain: "first"
  }
];

// Mock Apps List
export const mockApps = [
  { name: "CHUMS", url: "https://chums.org", icon: "people" },
  { name: "Giving", url: "https://giving.churchapps.org", icon: "volunteer_activism" },
  { name: "Lessons", url: "https://lessons.church", icon: "school" },
  { name: "B1", url: "https://b1.church", icon: "menu_book" }
];

// Mock Navigation Items
export const mockNavItems = [
  { icon: "home", label: "Home", url: "/" },
  { icon: "people", label: "People", url: "/people" },
  { icon: "event", label: "Events", url: "/events" },
  { icon: "volunteer_activism", label: "Donations", url: "/donations" },
  { icon: "chat", label: "Messages", url: "/messages" },
  { icon: "settings", label: "Settings", url: "/settings" }
];

// Mock Private Messages
export const mockPrivateMessages = [
  {
    id: "msg1",
    fromPersonId: "person123",
    toPersonId: "person456",
    subject: "Welcome to the church!",
    body: "Hi there! Welcome to our church family. We're excited to have you join us.",
    timeSent: new Date("2024-01-01T10:00:00Z"),
    readDate: null,
    fromPerson: { displayName: "John Doe", photo: "/images/logo-login.png" },
    toPerson: { displayName: "Jane Smith", photo: "/images/logo-login.png" }
  },
  {
    id: "msg2",
    fromPersonId: "person456",
    toPersonId: "person123", 
    subject: "Thank you!",
    body: "Thank you for the warm welcome. I'm looking forward to being part of the community.",
    timeSent: new Date("2024-01-01T14:30:00Z"),
    readDate: new Date("2024-01-01T15:00:00Z"),
    fromPerson: { displayName: "Jane Smith", photo: "/images/logo-login.png" },
    toPerson: { displayName: "John Doe", photo: "/images/logo-login.png" }
  }
];

// Mock Notes
export const mockNotes = [
  {
    id: "note1",
    contentType: "person",
    contentId: "person123",
    contents: "Very active in church activities. Volunteers regularly.",
    created: new Date("2024-01-01"),
    createdBy: "John Doe"
  },
  {
    id: "note2",
    contentType: "person", 
    contentId: "person123",
    contents: "Interested in joining the worship team.",
    created: new Date("2024-01-15"),
    createdBy: "Jane Smith"
  }
];

// Mock Report Data
export const mockReportData = {
  columns: [
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "membershipStatus", headerName: "Status", width: 120 },
    { field: "lastAttendance", headerName: "Last Attendance", width: 150 }
  ],
  rows: [
    { 
      id: 1, 
      name: "John Doe", 
      email: "john.doe@example.com", 
      phone: "555-1234", 
      membershipStatus: "Member",
      lastAttendance: "2024-01-07"
    },
    { 
      id: 2, 
      name: "Jane Smith", 
      email: "jane.smith@example.com", 
      phone: "555-5678", 
      membershipStatus: "Visitor",
      lastAttendance: "2024-01-06"
    },
    { 
      id: 3, 
      name: "Bob Johnson", 
      email: "bob.johnson@example.com", 
      phone: "555-9012", 
      membershipStatus: "Member",
      lastAttendance: "2024-01-05"
    }
  ]
};

// Mock Chart Data
export const mockChartData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Attendance",
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1
    },
    {
      label: "New Members",
      data: [5, 3, 8, 4, 2, 6],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1
    }
  ]
};

// Mock Appearance Settings
export const mockAppearance = {
  primaryColor: "#1976d2",
  secondaryColor: "#dc004e", 
  logoUrl: "/images/logo-login.png",
  headerBackgroundColor: "#f5f5f5",
  headerTextColor: "#333333",
  churchName: "Sample Community Church"
};

// Export a complete mock context
export const createMockUserContext = (): UserContextInterface => ({
  user: mockUser,
  setUser: () => {},
  userChurch: mockUserChurch,
  setUserChurch: () => {},
  userChurches: [mockUserChurch],
  setUserChurches: () => {},
  person: mockPerson,
  setPerson: () => {}
});