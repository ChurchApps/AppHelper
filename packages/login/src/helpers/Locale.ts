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

	// English fallbacks for all login-related labels
	private static readonly fallbacks: Record<string, string> = {
		// Common
		"common.pleaseWait": "Please wait...",
		"common.search": "Search",

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
		"selectChurch.validate.zip": "Zip/Postal code cannot be blank."
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
