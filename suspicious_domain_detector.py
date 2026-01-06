"""
Suspicious Domain Detector
===========================
A machine learning project to identify fake/phishing domain names
using a Decision Tree Classifier.

Algorithm: Decision Tree Classifier
Features: Length, digits, hyphens, dots, suspicious keywords, TLD risk, etc.
"""

import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import re
from collections import Counter
import math

# =============================================================================
# DATASET - Large collection of safe and suspicious domains
# =============================================================================

SAFE_DOMAINS = [
    # Major tech companies
    "google.com", "facebook.com", "amazon.com", "microsoft.com", "apple.com",
    "netflix.com", "twitter.com", "linkedin.com", "instagram.com", "youtube.com",
    "github.com", "stackoverflow.com", "reddit.com", "wikipedia.org", "yahoo.com",

    # Banks and financial (legitimate)
    "chase.com", "bankofamerica.com", "wellsfargo.com", "citibank.com", "paypal.com",
    "visa.com", "mastercard.com", "americanexpress.com", "capitalone.com", "discover.com",

    # E-commerce
    "ebay.com", "walmart.com", "target.com", "bestbuy.com", "etsy.com",
    "shopify.com", "alibaba.com", "aliexpress.com", "wish.com", "wayfair.com",

    # News and media
    "cnn.com", "bbc.com", "nytimes.com", "forbes.com", "reuters.com",
    "bloomberg.com", "washingtonpost.com", "theguardian.com", "espn.com", "weather.com",

    # Tech and software
    "adobe.com", "salesforce.com", "oracle.com", "ibm.com", "intel.com",
    "nvidia.com", "amd.com", "cisco.com", "vmware.com", "dropbox.com",

    # Social and communication
    "whatsapp.com", "telegram.org", "discord.com", "slack.com", "zoom.us",
    "skype.com", "snapchat.com", "tiktok.com", "pinterest.com", "tumblr.com",

    # Education and reference
    "coursera.org", "udemy.com", "khanacademy.org", "edx.org", "mit.edu",
    "harvard.edu", "stanford.edu", "cambridge.org", "oxford.ac.uk", "nature.com",

    # Other legitimate sites
    "spotify.com", "airbnb.com", "uber.com", "lyft.com", "doordash.com",
    "grubhub.com", "yelp.com", "tripadvisor.com", "booking.com", "expedia.com",
]

SUSPICIOUS_DOMAINS = [
    # Lookalike domains with number substitution
    "g00gle.com", "g0ogle-login.net", "faceb00k-security.com", "amaz0n-verify.net",
    "micr0soft-support.com", "app1e-id.net", "netf1ix-account.com", "paypa1-secure.net",
    "linkedln-verify.com", "1nstagram-help.net", "yah00-mail.com", "tw1tter-support.net",

    # Suspicious keyword domains
    "google-login-verify.com", "facebook-security-alert.net", "amazon-account-update.com",
    "microsoft-password-reset.net", "apple-id-locked.com", "netflix-payment-update.net",
    "paypal-confirm-identity.com", "bank-secure-login.net", "account-verify-now.com",
    "secure-login-portal.net", "update-your-account.com", "verify-identity-now.net",

    # Banking phishing attempts
    "chase-secure-login.net", "bankofamerica-verify.com", "wellsfargo-alert.net",
    "citibank-security.com", "paypal-limited.net", "visa-card-blocked.com",
    "mastercard-alert.net", "capitalone-verify.com", "discover-secure.net",
    "bank-account-suspended.com", "credit-card-verify.net", "secure-banking-login.com",

    # Random/gibberish domains
    "xk7fg9-login.net", "abc123-verify.com", "qwerty-secure.net", "zxcvbn-account.com",
    "asdfgh-bank.net", "poiuyt-login.com", "mnbvcx-verify.net", "lkjhgf-secure.com",
    "a1b2c3d4-support.net", "xyz789-account.com", "random123-login.net", "test456-verify.com",

    # Excessive hyphens and subdomains
    "secure-login-verify-account.com", "update-password-now-urgent.net",
    "confirm-identity-bank-secure.com", "verify-account-login-now.net",
    "reset-password-urgent-action.com", "account-suspended-verify-now.net",
    "login-secure-verify-identity.com", "bank-alert-action-required.net",

    # Suspicious TLDs
    "google-login.xyz", "facebook-verify.top", "amazon-support.club", "microsoft-help.work",
    "apple-security.click", "netflix-update.loan", "paypal-verify.gq", "bank-login.tk",
    "secure-account.ml", "verify-now.ga", "login-portal.cf", "update-account.buzz",

    # IP-like or encoded domains
    "192-168-1-login.com", "secure-10-0-0-1.net", "login-172-16-0.com",
    "verify-192-168-0.net", "account-10-10-10.com", "bank-255-255-255.net",

    # Typosquatting
    "googel.com", "gooogle.com", "fcebook.com", "facebok.com", "amazn.com",
    "amazom.com", "mircosoft.com", "microsft.com", "appel.com", "aple.com",
    "netfilx.com", "nteflix.com", "paypall.com", "paypl.com", "linkedn.com",

    # Long suspicious domains
    "your-account-has-been-compromised-verify-now.com",
    "urgent-security-alert-login-immediately.net",
    "confirm-your-identity-to-restore-access.com",
    "your-payment-method-needs-verification.net",
    "suspicious-activity-detected-verify-account.com",
]

# Risky TLDs commonly used in phishing
RISKY_TLDS = [
    '.xyz', '.top', '.club', '.work', '.click', '.loan', '.gq', '.tk',
    '.ml', '.ga', '.cf', '.buzz', '.icu', '.vip', '.win', '.bid',
    '.stream', '.racing', '.download', '.party', '.science', '.date'
]

# Suspicious keywords often found in phishing domains
SUSPICIOUS_KEYWORDS = [
    'login', 'secure', 'verify', 'account', 'update', 'bank', 'password',
    'confirm', 'identity', 'suspend', 'locked', 'alert', 'urgent', 'action',
    'required', 'limited', 'blocked', 'reset', 'support', 'help', 'service',
    'security', 'notification', 'restore', 'access', 'compromised', 'payment'
]

# Known brand names to check for impersonation
KNOWN_BRANDS = [
    'google', 'facebook', 'amazon', 'microsoft', 'apple', 'netflix', 'paypal',
    'twitter', 'instagram', 'linkedin', 'yahoo', 'ebay', 'chase', 'wellsfargo',
    'bankofamerica', 'citibank', 'visa', 'mastercard', 'dropbox', 'spotify',
    'adobe', 'github', 'walmart', 'target', 'bestbuy', 'whatsapp', 'snapchat'
]

# Leet speak substitutions (number -> letters it could replace)
LEET_SPEAK_MAP = {
    '0': ['o'],
    '1': ['i', 'l'],
    '3': ['e'],
    '4': ['a'],
    '5': ['s'],
    '6': ['g'],
    '7': ['t'],
    '8': ['b'],
    '9': ['g', 'q'],
}

# =============================================================================
# FEATURE EXTRACTION
# =============================================================================

def calculate_entropy(text):
    """Calculate Shannon entropy of a string (measures randomness)."""
    if not text:
        return 0
    counter = Counter(text)
    length = len(text)
    entropy = -sum((count/length) * math.log2(count/length) for count in counter.values())
    return round(entropy, 3)


def decode_leet_speak(text):
    """
    Convert leet speak back to regular letters.
    Returns the decoded string.
    """
    # Simple approach: replace each leet character with its primary letter equivalent
    decoded = text.lower()
    for num, letters in LEET_SPEAK_MAP.items():
        decoded = decoded.replace(num, letters[0])
    return decoded


def check_brand_impersonation(domain):
    """
    Check if a domain is trying to impersonate a known brand using leet speak.
    Returns (is_impersonation, matched_brand, similarity_score)
    """
    # Get the main part of the domain (before TLD)
    domain_lower = domain.lower()
    main_part = domain_lower.rsplit('.', 1)[0]

    # Remove common separators for comparison
    main_part_clean = main_part.replace('-', '').replace('.', '')

    # Decode leet speak
    decoded = decode_leet_speak(main_part_clean)

    # Check against known brands
    for brand in KNOWN_BRANDS:
        # Check if decoded version matches or contains the brand
        if brand in decoded or decoded in brand:
            # It's suspicious if the original contains numbers (leet speak)
            if any(c.isdigit() for c in main_part_clean):
                return (1, brand, 1.0)

        # Check for very close matches (edit distance)
        distance = levenshtein_distance(decoded, brand)
        max_len = max(len(decoded), len(brand))
        similarity = 1 - (distance / max_len) if max_len > 0 else 0

        # If very similar but not exact, could be typosquatting
        if similarity >= 0.8 and decoded != brand:
            return (1, brand, similarity)

    return (0, None, 0)


def levenshtein_distance(s1, s2):
    """Calculate the Levenshtein (edit) distance between two strings."""
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)

    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]


def count_leet_substitutions(text):
    """Count how many leet speak substitutions are in the text."""
    count = 0
    for char in text:
        if char in LEET_SPEAK_MAP:
            count += 1
    return count


def extract_features(domain):
    """
    Extract features from a domain name for classification.

    Features:
    1. length - Total length of domain
    2. digits - Count of numeric characters
    3. hyphens - Count of hyphens
    4. dots - Count of dots
    5. suspicious_keywords - Count of suspicious keywords found
    6. risky_tld - Whether TLD is considered risky (1 or 0)
    7. subdomain_count - Number of subdomains
    8. entropy - Shannon entropy (randomness measure)
    9. digit_ratio - Ratio of digits to total length
    10. has_ip_pattern - Whether domain contains IP-like patterns
    11. leet_speak_count - Count of leet speak character substitutions
    12. brand_impersonation - Whether domain impersonates a known brand (1 or 0)
    """
    domain_lower = domain.lower()

    # Basic counts
    length = len(domain)
    digits = sum(c.isdigit() for c in domain)
    hyphens = domain.count('-')
    dots = domain.count('.')

    # Suspicious keywords count
    suspicious_keywords = sum(1 for keyword in SUSPICIOUS_KEYWORDS if keyword in domain_lower)

    # Check for risky TLD
    risky_tld = 1 if any(domain_lower.endswith(tld) for tld in RISKY_TLDS) else 0

    # Subdomain count (dots before main domain)
    subdomain_count = max(0, dots - 1)

    # Entropy (randomness)
    # Remove TLD for entropy calculation
    domain_without_tld = domain_lower.rsplit('.', 1)[0]
    entropy = calculate_entropy(domain_without_tld)

    # Digit ratio
    digit_ratio = round(digits / length, 3) if length > 0 else 0

    # IP-like pattern detection
    ip_pattern = r'\d{1,3}[-\.]\d{1,3}[-\.]\d{1,3}'
    has_ip_pattern = 1 if re.search(ip_pattern, domain) else 0

    # Leet speak detection
    leet_speak_count = count_leet_substitutions(domain_without_tld)

    # Brand impersonation detection
    brand_impersonation, _, _ = check_brand_impersonation(domain)

    return {
        'length': length,
        'digits': digits,
        'hyphens': hyphens,
        'dots': dots,
        'suspicious_keywords': suspicious_keywords,
        'risky_tld': risky_tld,
        'subdomain_count': subdomain_count,
        'entropy': entropy,
        'digit_ratio': digit_ratio,
        'has_ip_pattern': has_ip_pattern,
        'leet_speak_count': leet_speak_count,
        'brand_impersonation': brand_impersonation
    }


# =============================================================================
# DATA PREPARATION
# =============================================================================

def prepare_dataset():
    """Prepare the dataset with features and labels."""
    data = []

    # Process safe domains (label = 0)
    for domain in SAFE_DOMAINS:
        features = extract_features(domain)
        features['domain'] = domain
        features['label'] = 0  # Safe
        data.append(features)

    # Process suspicious domains (label = 1)
    for domain in SUSPICIOUS_DOMAINS:
        features = extract_features(domain)
        features['domain'] = domain
        features['label'] = 1  # Suspicious
        data.append(features)

    return pd.DataFrame(data)


# =============================================================================
# MODEL TRAINING
# =============================================================================

def train_model(df):
    """Train the Decision Tree Classifier."""
    # Feature columns
    feature_columns = [
        'length', 'digits', 'hyphens', 'dots', 'suspicious_keywords',
        'risky_tld', 'subdomain_count', 'entropy', 'digit_ratio', 'has_ip_pattern',
        'leet_speak_count', 'brand_impersonation'
    ]

    X = df[feature_columns]
    y = df['label']

    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Create and train the Decision Tree Classifier
    model = DecisionTreeClassifier(
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42
    )
    model.fit(X_train, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    return model, feature_columns, X_test, y_test, y_pred, accuracy


# =============================================================================
# PREDICTION
# =============================================================================

def predict_domain(model, feature_columns, domain):
    """Predict if a domain is safe or suspicious."""
    features = extract_features(domain)

    # Create DataFrame with feature names to avoid sklearn warning
    feature_df = pd.DataFrame([[features[col] for col in feature_columns]], columns=feature_columns)

    prediction = model.predict(feature_df)[0]
    probability = model.predict_proba(feature_df)[0]

    return {
        'domain': domain,
        'prediction': 'Suspicious' if prediction == 1 else 'Safe',
        'confidence': round(max(probability) * 100, 2),
        'features': features
    }


# =============================================================================
# DISPLAY FUNCTIONS
# =============================================================================

def print_banner():
    """Print application banner."""
    print("=" * 60)
    print("       SUSPICIOUS DOMAIN DETECTOR")
    print("       Using Decision Tree Classifier")
    print("=" * 60)
    print()


def print_dataset_info(df):
    """Print dataset information."""
    print("DATASET INFORMATION")
    print("-" * 40)
    print(f"Total domains: {len(df)}")
    print(f"Safe domains: {len(df[df['label'] == 0])}")
    print(f"Suspicious domains: {len(df[df['label'] == 1])}")
    print()

    print("FEATURE COLUMNS")
    print("-" * 40)
    feature_cols = ['length', 'digits', 'hyphens', 'dots', 'suspicious_keywords',
                    'risky_tld', 'subdomain_count', 'entropy', 'digit_ratio', 'has_ip_pattern',
                    'leet_speak_count', 'brand_impersonation']
    for i, col in enumerate(feature_cols, 1):
        print(f"  {i}. {col}")
    print()


def print_model_evaluation(accuracy, y_test, y_pred):
    """Print model evaluation metrics."""
    print("MODEL EVALUATION")
    print("-" * 40)
    print(f"Accuracy: {accuracy * 100:.2f}%")
    print()

    print("Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Safe', 'Suspicious']))

    print("Confusion Matrix:")
    cm = confusion_matrix(y_test, y_pred)
    print(f"  True Negatives (Safe correctly identified): {cm[0][0]}")
    print(f"  False Positives (Safe marked as Suspicious): {cm[0][1]}")
    print(f"  False Negatives (Suspicious marked as Safe): {cm[1][0]}")
    print(f"  True Positives (Suspicious correctly identified): {cm[1][1]}")
    print()


def print_prediction_result(result):
    """Print prediction result for a domain."""
    print("-" * 40)
    print(f"Domain: {result['domain']}")
    print(f"Prediction: {result['prediction']}")
    print(f"Confidence: {result['confidence']}%")
    print()
    print("Extracted Features:")
    for key, value in result['features'].items():
        print(f"  - {key}: {value}")
    print("-" * 40)


def print_sample_data(df):
    """Print sample of the dataset."""
    print("SAMPLE DATA (First 10 rows)")
    print("-" * 40)
    display_cols = ['domain', 'length', 'digits', 'hyphens', 'suspicious_keywords', 'label']
    print(df[display_cols].head(10).to_string(index=False))
    print()


# =============================================================================
# MAIN PROGRAM
# =============================================================================

def main():
    """Main function to run the Suspicious Domain Detector."""
    print_banner()

    # Step 1: Prepare dataset
    print("Step 1: Preparing dataset...")
    df = prepare_dataset()
    print_dataset_info(df)
    print_sample_data(df)

    # Step 2: Train model
    print("Step 2: Training Decision Tree Classifier...")
    model, feature_columns, X_test, y_test, y_pred, accuracy = train_model(df)
    print("Model trained successfully!\n")

    # Step 3: Evaluate model
    print("Step 3: Evaluating model...")
    print_model_evaluation(accuracy, y_test, y_pred)

    # Step 4: Test with example domains
    print("Step 4: Testing with example domains...")
    print("=" * 60)

    test_domains = [
        "google.com",
        "g00gle-login-verify.net",
        "amazon.com",
        "amaz0n-account-update.xyz",
        "github.com",
        "secure-bank-login-verify.tk",
        "microsoft.com",
        "micr0soft-password-reset.club"
    ]

    for domain in test_domains:
        result = predict_domain(model, feature_columns, domain)
        print_prediction_result(result)

    # Step 5: Interactive mode
    print("\n" + "=" * 60)
    print("INTERACTIVE MODE")
    print("Enter domain names to check (type 'quit' to exit)")
    print("=" * 60)

    while True:
        try:
            user_input = input("\nEnter domain: ").strip()

            if user_input.lower() in ['quit', 'exit', 'q']:
                print("\nThank you for using Suspicious Domain Detector!")
                break

            if not user_input:
                print("Please enter a valid domain name.")
                continue

            result = predict_domain(model, feature_columns, user_input)
            print_prediction_result(result)

        except KeyboardInterrupt:
            print("\n\nExiting...")
            break


if __name__ == "__main__":
    main()
