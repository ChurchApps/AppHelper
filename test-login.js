const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable console logging to see our debug output
  page.on('console', msg => {
    console.log('Browser console:', msg.text());
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log('Page error:', error.message);
  });

  try {
    // Navigate to the login page
    console.log('Navigating to login page...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    // Take a screenshot to see what's on the page
    await page.screenshot({ path: 'login-page.png' });
    
    // Print page content for debugging
    const pageContent = await page.content();
    console.log('Page title:', await page.title());
    
    // Look for tab elements
    const tabs = await page.locator('button').all();
    console.log('Found buttons:', tabs.length);
    for (let i = 0; i < tabs.length; i++) {
      const text = await tabs[i].textContent();
      console.log(`Button ${i}: "${text}"`);
    }
    
    // Click the exact "Login" button to test the Login component
    console.log('Clicking Login button...');
    const loginButton = await page.getByRole('button', { name: 'Login', exact: true });
    console.log('Login button found:', await loginButton.count());
    await loginButton.click();
    await page.waitForTimeout(2000);
    
    // Check if button was clicked successfully
    const selectedButton = await page.locator('button:has-text("Login")[variant="contained"]');
    console.log('Login button appears selected:', await selectedButton.count() > 0);
    
    // Scroll to find the Login component
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    
    // Wait for the Login component to be rendered
    try {
      await page.waitForSelector('text=Login Component', { timeout: 5000 });
      console.log('Login component section found!');
    } catch (error) {
      console.log('Login component section not found, looking for other indicators...');
    }
    
    // Check if the component is actually being rendered
    const currentContent = await page.content();
    console.log('Page contains email input:', currentContent.includes('type="email"'));
    console.log('Page contains password input:', currentContent.includes('type="password"'));
    console.log('Page contains Sign in:', currentContent.includes('Sign in'));
    
    // Take another screenshot to see the login component
    await page.screenshot({ path: 'login-component.png' });
    
    // Check for any error messages in the console
    console.log('Looking for all input fields...');
    const allInputs = await page.locator('input').all();
    console.log('Found input fields:', allInputs.length);
    
    // Check if there are any hidden elements
    const hiddenLogin = await page.locator('div:has-text("Login")').all();
    console.log('Found divs with Login text:', hiddenLogin.length);
    
    // Wait for login form fields to be visible
    try {
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      console.log('Email field found!');
    } catch (error) {
      console.log('Email field not found');
    }
    
    const emailField = await page.locator('input[type="email"]').first();
    const passwordField = await page.locator('input[type="password"]').first();
    const signInButton = await page.locator('button:has-text("Sign in")').first();
    
    console.log('Email field visible:', await emailField.isVisible());
    console.log('Password field visible:', await passwordField.isVisible());
    console.log('Sign in button visible:', await signInButton.isVisible());

    // Clear the form fields first to test validation
    console.log('Clearing form fields to test validation...');
    await emailField.fill('');
    await passwordField.fill('');
    await page.waitForTimeout(1000);
    
    // Try to submit the form without filling anything (should trigger validation)
    console.log('Attempting to submit empty form...');
    if (await signInButton.isVisible()) {
      await signInButton.click();
      console.log('Clicked sign in button');
    } else {
      console.log('Sign in button not found');
    }
    await page.waitForTimeout(2000);

    // Check if there are any error messages visible
    const errorElements = await page.locator('[role="alert"], .MuiAlert-root').all();
    console.log('Found error elements:', errorElements.length);

    // Try filling in invalid data and submitting
    console.log('Testing with invalid email...');
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'test');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Check console output for our debug messages
    console.log('Test completed');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
})();