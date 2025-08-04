import i18n from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-chained-backend";
import HttpBackend from "i18next-http-backend";

interface TranslationResources {
	[key: string]: {
		translation: Record<string, unknown>;
	};
}

interface ExtraLanguageCodes {
	[key: string]: string[];
}

export class Locale {
	private static readonly supportedLanguages: string[] = [
		"de",
		"en",
		"es",
		"fr",
		"hi",
		"it",
		"ko",
		"no",
		"pt",
		"ru",
		"tl",
		"zh",
	];
	private static readonly extraCodes: ExtraLanguageCodes = { no: ["nb", "nn"] };

	// English fallbacks for all donation and login-related labels
	private static readonly fallbacks: Record<string, string> = {
		// Common
		"common.pleaseWait": "Please wait...",
		"common.search": "Search",

		// Person
		"person.firstName": "First Name",
		"person.lastName": "Last Name",
		"person.email": "Email",
		"person.name": "Name",

		// Login
		"login.createAccount": "Create an Account",
		"login.email": "Email",
		"login.expiredLink": "The current link is expired.",
		"login.forgot": "Forgot Password",
		"login.goLogin": "Go to Login",
		"login.login": "Login",
		"login.password": "Password",
		"login.register": "Register",
		"login.registerThankYou": "Thank you for registering! Please check your email to verify your account.",
		"login.requestLink": "Request a new reset link",
		"login.reset": "Reset",
		"login.resetInstructions": "Enter your email address to request a password reset.",
		"login.resetPassword": "Reset Password",
		"login.resetSent": "Password reset email sent!",
		"login.setPassword": "Set Password",
		"login.signIn": "Sign In",
		"login.signInTitle": "Please Sign In",
		"login.verifyPassword": "Verify Password",
		"login.welcomeName": "Welcome back, {}!",
		"login.welcomeBack": "Welcome back",

		// Login validation
		"login.validate.email": "Please enter a valid email address.",
		"login.validate.firstName": "Please enter your first name.",
		"login.validate.invalid": "Invalid login. Please check your email or password.",
		"login.validate.lastName": "Please enter your last name.",
		"login.validate.password": "Please enter a password.",
		"login.validate.passwordLength": "Password must be at least 8 characters long.",
		"login.validate.passwordMatch": "Passwords do not match.",
		"login.validate.selectingChurch": "Please select a church.",

		// Church selection
		"selectChurch.address1": "Address Line 1",
		"selectChurch.address2": "Address Line 2",
		"selectChurch.another": "Choose another church",
		"selectChurch.city": "City",
		"selectChurch.confirmRegister": "Are you sure you wish to register a new church?",
		"selectChurch.country": "Country",
		"selectChurch.name": "Church Name",
		"selectChurch.noMatches": "No matches found.",
		"selectChurch.register": "Register a New Church",
		"selectChurch.selectChurch": "Select a Church",
		"selectChurch.state": "State / Province",
		"selectChurch.zip": "Zip / Postal Code",

		// Church selection validation
		"selectChurch.validate.address": "Address cannot be blank.",
		"selectChurch.validate.city": "City cannot be blank.",
		"selectChurch.validate.country": "Country cannot be blank.",
		"selectChurch.validate.name": "Church name cannot be blank.",
		"selectChurch.validate.state": "State/Province cannot be blank.",
		"selectChurch.validate.zip": "Zip/Postal code cannot be blank.",

		// Donation common
		"donation.common.cancel": "Cancel",
		"donation.common.error": "Error",

		// Bank form
		"donation.bankForm.accountNumber": "Account Number",
		"donation.bankForm.added": "Bank account added. Verify your bank account to make a donation.",
		"donation.bankForm.company": "Company",
		"donation.bankForm.firstDeposit": "First Deposit",
		"donation.bankForm.holderName": "Account holder name is required.",
		"donation.bankForm.individual": "Individual",
		"donation.bankForm.name": "Account Holder Name",
		"donation.bankForm.needVerified": "Bank accounts will need to be verified before making any donations. Your account will receive two small deposits in approximately 1-3 business days. You will need to enter those deposit amounts to finish verifying your account by selecting the verify account link next to your bank account under the payment methods section.",
		"donation.bankForm.routingNumber": "Routing Number",
		"donation.bankForm.secondDeposit": "Second Deposit",
		"donation.bankForm.twoDeposits": "Enter the two deposits you received in your account to finish verifying your bank account.",
		"donation.bankForm.updated": "Bank account updated.",
		"donation.bankForm.verified": "Bank account verified.",
		"donation.bankForm.validate.accountNumber": "Routing and account number are required.",
		"donation.bankForm.validate.holderName": "Account holder name is required.",

		// Card form
		"donation.cardForm.addNew": "Add New Card",
		"donation.cardForm.added": "Card added successfully.",
		"donation.cardForm.expirationMonth": "Expiration Month:",
		"donation.cardForm.expirationYear": "Expiration Year:",
		"donation.cardForm.updated": "Card updated successfully.",

		// Donation form
		"donation.donationForm.annually": "Annually",
		"donation.donationForm.biWeekly": "Bi-Weekly",
		"donation.donationForm.cancelled": "Recurring donation cancelled.",
		"donation.donationForm.confirmDelete": "Are you sure you wish to delete this recurring donation?",
		"donation.donationForm.cover": "I'll generously add {} to cover the transaction fees so you can keep 100% of my donation.",
		"donation.donationForm.donate": "Donate",
		"donation.donationForm.editRecurring": "Edit Recurring Donation",
		"donation.donationForm.fees": "Transaction fees of {} are applied.",
		"donation.donationForm.frequency": "Frequency",
		"donation.donationForm.fund": "Fund",
		"donation.donationForm.funds": "Funds",
		"donation.donationForm.make": "Make a Donation",
		"donation.donationForm.makeRecurring": "Make a Recurring Donation",
		"donation.donationForm.method": "Method",
		"donation.donationForm.monthly": "Monthly",
		"donation.donationForm.notes": "Notes",
		"donation.donationForm.preview": "Preview Donation",
		"donation.donationForm.quarterly": "Quarterly",
		"donation.donationForm.recurringUpdated": "Recurring donation updated.",
		"donation.donationForm.startDate": "Start Date",
		"donation.donationForm.thankYou": "Thank you for your donation!",
		"donation.donationForm.tooLow": "Donation amount must be greater than $0.50",
		"donation.donationForm.total": "Total Donation Amount",
		"donation.donationForm.validate.amount": "Amount cannot be $0.",
		"donation.donationForm.validate.email": "Please enter your email address.",
		"donation.donationForm.validate.firstName": "Please enter your first name.",
		"donation.donationForm.validate.lastName": "Please enter your last name.",
		"donation.donationForm.validate.validEmail": "Please enter a valid email address.",
		"donation.donationForm.weekly": "Weekly",

		// Fund donations
		"donation.fundDonations.addMore": "Add More",
		"donation.fundDonations.amount": "Amount",
		"donation.fundDonations.fund": "Fund",

		// Payment methods
		"donation.paymentMethods.addBank": "Add Bank Account",
		"donation.paymentMethods.addCard": "Add Card",
		"donation.paymentMethods.confirmDelete": "Are you sure you wish to delete this payment method?",
		"donation.paymentMethods.deleted": "Payment method deleted.",
		"donation.paymentMethods.noMethod": "No payment methods. Add a payment method to make a donation.",
		"donation.paymentMethods.verify": "Verify Account",

		// Donation preview
		"donation.preview.date": "Donation Date",
		"donation.preview.donate": "Donate",
		"donation.preview.every": "Recurring Every",
		"donation.preview.fee": "Transaction Fee",
		"donation.preview.funds": "Funds",
		"donation.preview.method": "Donation Method",
		"donation.preview.notes": "Notes",
		"donation.preview.startingOn": "Starting On",
		"donation.preview.total": "Total",
		"donation.preview.type": "Donation Type",
		"donation.preview.weekly": "Notes",

		// Recurring donations
		"donation.recurring.amount": "Amount",
		"donation.recurring.every": "Every",
		"donation.recurring.interval": "Interval",
		"donation.recurring.notFound": "Payment method not found.",
		"donation.recurring.paymentMethod": "Payment Method",
		"donation.recurring.startDate": "Start Date"
	};

	static init = async (backends: string[]): Promise<void> => {
		const resources: TranslationResources = {};
		let langs = ["en"];

		if (typeof navigator !== "undefined") {
			const browserLang = navigator.language.split("-")[0];
			const mappedLang
				= Object.keys(this.extraCodes).find((code) =>
					this.extraCodes[code].includes(browserLang),
				) || browserLang;
			const notSupported = this.supportedLanguages.indexOf(mappedLang) === -1;
			langs = mappedLang === "en" || notSupported ? ["en"] : ["en", mappedLang];
		}

		// Initialize resources with fallbacks
		resources["en"] = { translation: this.fallbacks };

		// Load translations for each language
		for (const lang of langs) {
			if (!resources[lang]) {
				resources[lang] = { translation: {} };
			}
			
			try {
				for (const backend of backends) {
					const url = backend.replace("{{lng}}", lang);
					try {
						const response = await fetch(url);
						if (response.ok) {
							const data = await response.json();
							resources[lang].translation = this.deepMerge(
								resources[lang].translation,
								data,
							);
						}
					} catch (error) {
						console.warn(`Failed to load translations from ${url}:`, error);
					}
				}
			} catch (error) {
				console.warn(`Failed to load translations for language ${lang}:`, error);
			}
		}

		// Initialize i18n
		try {
			await i18n
				.use(Backend)
				.use(LanguageDetector)
				.use(initReactI18next)
				.init({
					resources,
					fallbackLng: "en",
					debug: false,
					interpolation: {
						escapeValue: false,
					},
					detection: {
						order: ["navigator"],
						caches: ["localStorage"],
					},
				});
		} catch (error) {
			console.warn("Failed to initialize i18n:", error);
		}
	};

	private static deepMerge(
		target: Record<string, unknown>,
		source: Record<string, unknown>,
	): Record<string, unknown> {
		for (const key in source) {
			if (this.isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				this.deepMerge(
					target[key] as Record<string, unknown>,
					source[key] as Record<string, unknown>,
				);
			} else Object.assign(target, { [key]: source[key] });
		}
		return target;
	}

	private static isObject(obj: unknown): boolean {
		return obj !== null && typeof obj === "object" && !Array.isArray(obj);
	}

	// New helper method that uses i18n with fallback
	static t(key: string, options?: Record<string, unknown>): string {
		try {
			// Check if i18n is initialized and has the key
			if (i18n && i18n.isInitialized && i18n.exists(key)) {
				const translation = i18n.t(key, options);
				// If translation is not just the key (which indicates missing translation)
				if (translation !== key) {
					return translation;
				}
			}
		} catch (error) {
			console.warn(`Error getting translation for key "${key}":`, error);
		}

		// Fall back to our local fallbacks
		const fallback = this.fallbacks[key];
		if (fallback) {
			// Handle simple string replacement like {} placeholders
			if (options && typeof options === 'object') {
				let result = fallback;
				Object.entries(options).forEach(([placeholder, value]) => {
					if (typeof value === 'string' || typeof value === 'number') {
						result = result.replace(`{${placeholder}}`, String(value));
						result = result.replace('{}', String(value)); // Handle unnamed placeholders
					}
				});
				return result;
			}
			return fallback;
		}

		// Ultimate fallback - return the key itself with a warning
		console.warn(`No translation found for key: ${key}`);
		return key;
	}

	// Keep the old method for backward compatibility
	static label(key: string): string {
		return this.t(key);
	}

	// Helper method to check if translations are available
	static isInitialized(): boolean {
		return i18n && i18n.isInitialized;
	}

	// Method to set up basic fallback-only mode (no i18n)
	static initFallbackMode(): void {
		console.info("Locale: Running in fallback mode with English labels only");
	}
}
