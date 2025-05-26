import React, { useState } from "react";
import CryptoJS from "crypto-js";
import "./App.css"; // We'll create this later for basic styling

//U2FsdGVkX1+Ux37PF/SxthgC99pMOMw2vR0Jx1coduU=

function App() {
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [decryptedMessageForDemo, setDecryptedMessageForDemo] = useState(""); // For demo purposes
  const [error, setError] = useState("");

  const handleEncrypt = () => {
    if (!message || !password) {
      setError("Please enter both a message and a password.");
      setEncryptedMessage("");
      return;
    }
    try {
      const ciphertext = CryptoJS.AES.encrypt(message, password).toString();
      setEncryptedMessage(ciphertext);
      setError("");
    } catch (e) {
      setError("Encryption failed. Please try again.");
      console.error("Encryption error:", e);
      setEncryptedMessage("");
    }
  };

  // --- Optional: Decryption part for demonstration or if the friend uses the same app ---
  const [messageToDecrypt, setMessageToDecrypt] = useState("");
  const [passwordForDecrypt, setPasswordForDecrypt] = useState("");

  const handleDecrypt = () => {
    if (!messageToDecrypt || !passwordForDecrypt) {
      setError("Please enter both encrypted message and password to decrypt.");
      setDecryptedMessageForDemo("");
      return;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(messageToDecrypt, passwordForDecrypt);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      if (!originalText) {
        // Important: If password is wrong, originalText might be empty or garbage
        setError("Decryption failed. Incorrect password or corrupted message.");
        setDecryptedMessageForDemo("");
        return;
      }
      setDecryptedMessageForDemo(originalText);
      setError("");
    } catch (e) {
      setError("Decryption failed. Incorrect password or corrupted message.");
      console.error("Decryption error:", e);
      setDecryptedMessageForDemo("");
    }
  };
  // --- End Optional Decryption Part ---

  const handleShareToWhatsApp = () => {
    if (!encryptedMessage) {
      alert("Please encrypt a message first.");
      return;
    }
    // IMPORTANT: Remind the user to share the password separately and securely!
    const shareText = `Here's an encrypted message.
You'll need the password we agreed on to decrypt it.
Encrypted: ${encryptedMessage}

(To decrypt, your friend might need this app or a compatible AES decryption tool.)`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank"); // Opens in a new tab/WhatsApp app
  };

  const handleCopyToClipboard = (textToCopy) => {
    if (!textToCopy) return;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => alert("Copied to clipboard!"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Message Encryptor & Sharer</h1>
      </header>
      <main className="container">
        {error && <p className="error-message">{error}</p>}

        <section className="card">
          <h2>Encrypt Message</h2>
          <div className="form-group">
            <label htmlFor="message">Your Message:</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your secret message"
              rows="4"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Encryption Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password"
            />
            <small>Share this password securely with your friend.</small>
          </div>
          <button onClick={handleEncrypt} className="button primary">
            Encrypt Message
          </button>

          {encryptedMessage && (
            <div className="result-area">
              <h3>Encrypted Message:</h3>
              <textarea
                value={encryptedMessage}
                readOnly
                rows="4"
                onClick={() => handleCopyToClipboard(encryptedMessage)}
                title="Click to copy"
              />
              <button
                onClick={() => handleCopyToClipboard(encryptedMessage)}
                className="button secondary"
              >
                Copy Encrypted Text
              </button>
              <button
                onClick={handleShareToWhatsApp}
                className="button whatsapp"
              >
                Share on WhatsApp
              </button>
            </div>
          )}
        </section>

        {/* Optional Decryption Section for Demo/Friend's Use */}
        <section className="card">
          <h2>Decrypt Message (For Friend/Demo)</h2>
          <p>
            Your friend would use this section (or a similar tool) with the
            password you shared.
          </p>
          <div className="form-group">
            <label htmlFor="messageToDecrypt">Encrypted Message:</label>
            <textarea
              id="messageToDecrypt"
              value={messageToDecrypt}
              onChange={(e) => setMessageToDecrypt(e.target.value)}
              placeholder="Paste encrypted message here"
              rows="4"
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwordForDecrypt">Decryption Password:</label>
            <input
              type="password"
              id="passwordForDecrypt"
              value={passwordForDecrypt}
              onChange={(e) => setPasswordForDecrypt(e.target.value)}
              placeholder="Enter the shared password"
            />
          </div>
          <button onClick={handleDecrypt} className="button primary">
            Decrypt Message
          </button>

          {decryptedMessageForDemo && (
            <div className="result-area">
              <h3>Decrypted Message:</h3>
              <textarea value={decryptedMessageForDemo} readOnly rows="4" />
            </div>
          )}
        </section>
      </main>
      <footer>
        <p>
          <strong>Important:</strong> This tool uses client-side AES encryption.
          The security of your message depends on the strength of your password
          and how securely you share it with your recipient. Do NOT share the
          password in the same WhatsApp message as the encrypted text.
        </p>
      </footer>
    </div>
  );
}

export default App;
