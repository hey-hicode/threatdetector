# Suspicious Domain Detector

A machine learning tool that identifies phishing/fake domain names using a Decision Tree Classifier.

## How It Works

The detector extracts 12 features from domain names and uses them to classify domains as **Safe** or **Suspicious**.

### Features Analyzed

| Feature | Description |
|---------|-------------|
| length | Total domain length |
| digits | Count of numbers |
| hyphens | Count of hyphens |
| dots | Count of dots |
| suspicious_keywords | Keywords like "login", "verify", "secure" |
| risky_tld | Risky TLDs like .xyz, .tk, .click |
| subdomain_count | Number of subdomains |
| entropy | Randomness measure (gibberish detection) |
| digit_ratio | Ratio of digits to length |
| has_ip_pattern | IP-like patterns (192-168-1) |
| leet_speak_count | Number substitutions (0 for o, 1 for l) |
| brand_impersonation | Similarity to known brands |

### Detection Examples

```
google.com       → Safe (legitimate)
g00gle.com       → Suspicious (leet speak + brand impersonation)
paypa1.com       → Suspicious (leet speak + brand impersonation)
secure-login.xyz → Suspicious (keywords + risky TLD)
```

## Usage

```bash
python suspicious_domain_detector.py
```

The script will:
1. Train the model on the built-in dataset
2. Show accuracy metrics
3. Enter interactive mode for testing domains

## Requirements

```
pandas
numpy
scikit-learn
```

Install with: `pip install pandas numpy scikit-learn`
