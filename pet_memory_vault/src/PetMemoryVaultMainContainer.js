import React, { useState } from "react";

// PUBLIC_INTERFACE
/**
 * PetMemoryVaultMainContainer
 * The central container of the PetMemoryVault web app. Handles navigation,
 * color theme, and scaffolds placeholders for all main features.
 *
 * Features:
 * - Navigation bar with sections: Timeline, Add Memory, Photos, Milestones, Scrapbook, Share Story, Profile
 * - Home section with paw image and Pet Profile Image upload
 * - Color scheme: primary (#F7C59F), secondary (#A1C6EA), accent (#F67280), light theme
 * - Pet-friendly, modern look throughout
 */
function PetMemoryVaultMainContainer() {
  // Navigation state
  const NAV_SECTIONS = [
    { name: "Home", label: "Home 🐾" },
    { name: "Timeline", label: "Timeline" },
    { name: "AddMemory", label: "Add Memory" },
    { name: "Photos", label: "Photos" },
    { name: "Milestones", label: "Milestones" },
    { name: "Scrapbook", label: "Scrapbook" },
    { name: "Share", label: "Share Story" }
  ];
  const [nav, setNav] = useState("Home");
  const [petProfileImage, setPetProfileImage] = useState(null);

  // Handlers
  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setPetProfileImage(imgUrl);
    }
  };

  // -- Main content rendering by section --
  function renderSection() {
    switch (nav) {
      case "Timeline":
        return <TimelinePlaceholder />;
      case "AddMemory":
        return <AddMemoryPlaceholder />;
      case "Photos":
        return <PhotosPlaceholder />;
      case "Milestones":
        return <MilestonesPlaceholder />;
      case "Scrapbook":
        return <ScrapbookPlaceholder />;
      case "Share":
        return <ShareStoryPlaceholder />;
      case "Home":
      default:
        return (
          <div className="pmv-home">
            <div className="pmv-paw-wrap">
              <img
                src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f43e.png"
                alt="Paw"
                className="pmv-paw-image"
              />
            </div>
            <h1 className="pmv-title">Your Pet Memory Vault</h1>
            <div className="pmv-profile-image-upload">
              <label className="pmv-profile-upload-label">
                {petProfileImage
                  ? (
                    <>
                      <img src={petProfileImage} alt="Pet Profile" className="pmv-profile-image-preview" />
                      <span>Change Pet Profile Photo</span>
                    </>
                  )
                  : (
                    <>
                      <div className="pmv-profile-placeholder"/>
                      <span>Upload Your Pet's Profile Photo</span>
                    </>
                  )
                }
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleProfileImageUpload}
                  data-testid="profile-upload-input"
                />
              </label>
            </div>
            <div className="pmv-home-desc">
              Welcome! Begin your pet’s story by uploading a profile photo, then create memories, milestones, and more.
            </div>
          </div>
        );
    }
  }

  // Navigation links
  const NavButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`pmv-nav-btn${active ? " pmv-nav-btn-active" : ""}`}
      tabIndex={0}
    >
      {children}
    </button>
  );

  // Layout
  return (
    <div className="pmv-app">
      <nav className="pmv-navbar">
        <span className="pmv-logo">
          <span className="pmv-logo-paw" aria-label="paw" role="img">🐾</span>{" "}
          PetMemoryVault
        </span>
        <div className="pmv-navbar-links">
          {NAV_SECTIONS.map(({ name, label }) => (
            <NavButton
              key={name}
              active={nav === name}
              onClick={() => setNav(name)}
            >
              {label}
            </NavButton>
          ))}
        </div>
      </nav>
      <main className="pmv-main fadein">{renderSection()}</main>
      <footer className="pmv-footer">
        &copy; {new Date().getFullYear()} PetMemoryVault &mdash; All rights reserved.
      </footer>
    </div>
  );
}


// Placeholder Components

function AddMemoryPlaceholder() {
  // PUBLIC_INTERFACE
  /** Placeholder for the Add Memory feature */
  return (
    <section className="pmv-section">
      <h2>Add a Memory</h2>
      <p>Add special pet moments here. (Form to be implemented.)</p>
      <button className="pmv-accent-btn disabled">Upload Photo</button>
      <button className="pmv-primary-btn disabled">Save Memory</button>
    </section>
  );
}

function TimelinePlaceholder() {
  // PUBLIC_INTERFACE
  /** Placeholder for the Timeline feature */
  return (
    <section className="pmv-section">
      <h2>Timeline</h2>
      <p>All your memories will appear here in chronological order.</p>
      <button className="pmv-primary-btn disabled">+ Add Memory</button>
      <div className="pmv-card-list"><div className="pmv-card pmv-card-empty">No memories yet.</div></div>
    </section>
  );
}

function PhotosPlaceholder() {
  // PUBLIC_INTERFACE
  /** Placeholder for the Photos feature */
  return (
    <section className="pmv-section">
      <h2>Photos</h2>
      <p>Upload and view your pet's best shots here.</p>
      <button className="pmv-accent-btn disabled">Upload Photo</button>
      <div className="pmv-photo-grid pmv-photo-grid-empty">No photos uploaded.</div>
    </section>
  );
}

function MilestonesPlaceholder() {
  // PUBLIC_INTERFACE
  /** Placeholder for the Milestones feature */
  return (
    <section className="pmv-section">
      <h2>Milestones</h2>
      <p>Add and browse important events in your pet’s life.</p>
      <button className="pmv-secondary-btn disabled">Add Milestone</button>
      <ul className="pmv-milestone-list pmv-milestone-list-empty">
        <li>No milestones added yet.</li>
      </ul>
    </section>
  );
}

function ScrapbookPlaceholder() {
  // PUBLIC_INTERFACE
  /** Placeholder for the Scrapbook feature */
  return (
    <section className="pmv-section">
      <h2>Digital Scrapbook</h2>
      <p>Your printable, auto-updating scrapbook including all photos and milestones.</p>
      <button className="pmv-primary-btn disabled">Print Scrapbook</button>
      <div className="pmv-scrapbook-preview pmv-scrapbook-preview-empty">
        <span>Scrapbook entries will appear here.</span>
      </div>
    </section>
  );
}

function ShareStoryPlaceholder() {
  // PUBLIC_INTERFACE
  /** Placeholder for the Shareable Story Timeline feature */
  return (
    <section className="pmv-section">
      <h2>Share Your Pet’s Story</h2>
      <p>Easily share your timeline and scrapbook with a private or public link.</p>
      <button className="pmv-accent-btn disabled">Get Shareable Link</button>
      <div className="pmv-share-desc">
        <span>No links generated yet.</span>
      </div>
    </section>
  );
}

export default PetMemoryVaultMainContainer;
