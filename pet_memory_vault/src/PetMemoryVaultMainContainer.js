import React, { useState } from "react";

/**
 * PetMemoryVaultMainContainer
 * Central container for PetMemoryVault.
 * - Simulates local stateful storage of memories, photos, and milestones (no backend).
 * - Enables add, view, and interaction for all three data types.
 * - Provides modal dialogs with forms and basic client validation.
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

  // --- DATA STATE ---
  const [memories, setMemories] = useState([]); // [{title, story, photoURL, date}]
  const [photos, setPhotos] = useState([]); // [{caption, photoURL, date}]
  const [milestones, setMilestones] = useState([]); // [{title, description, date}]

  // Modal/modal content states
  // modal: null | 'addMemory' | 'uploadPhotoAddMemory' | 'uploadPhotoPhotos' | 'addMilestone'
  const [modal, setModal] = useState(null);

  // --- FORM STATE ---
  const [memoryForm, setMemoryForm] = useState({
    title: "",
    date: "",
    story: "",
    photo: null,
    photoURL: "",
    error: ""
  });
  const [photoForm, setPhotoForm] = useState({
    caption: "",
    date: "",
    photo: null,
    photoURL: "",
    error: ""
  });
  const [milestoneForm, setMilestoneForm] = useState({
    title: "",
    date: "",
    description: "",
    error: ""
  });

  // Profile image upload
  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setPetProfileImage(imgUrl);
    }
  };

  // Modal close (also resets form errors)
  function closeModal() {
    setModal(null);
    setMemoryForm({ title: "", date: "", story: "", photo: null, photoURL: "", error: "" });
    setPhotoForm({ caption: "", date: "", photo: null, photoURL: "", error: "" });
    setMilestoneForm({ title: "", date: "", description: "", error: "" });
  }

  // --- ADD MEMORY FORM ---
  function handleMemoryPhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      setMemoryForm((f) => ({
        ...f,
        photo: file,
        photoURL: URL.createObjectURL(file),
        error: ""
      }));
    }
  }
  function handleMemoryChange(e) {
    const { name, value } = e.target;
    setMemoryForm((f) => ({ ...f, [name]: value, error: "" }));
  }
  function handleSubmitMemory(e) {
    e.preventDefault();
    // Validate
    if (!memoryForm.title.trim() || !memoryForm.date.trim() || !memoryForm.story.trim()) {
      setMemoryForm(f => ({ ...f, error: "All fields except photo are required." }));
      return;
    }
    // Add to memories
    setMemories(prev => [
      {
        title: memoryForm.title,
        date: memoryForm.date,
        story: memoryForm.story,
        photoURL: memoryForm.photoURL,
        id: Date.now()
      },
      ...prev
    ]);
    closeModal();
  }

  // --- UPLOAD PHOTO FORM (Add Memory or Photos) ---
  function handlePhotoPhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      setPhotoForm((f) => ({ ...f, photo: file, photoURL: URL.createObjectURL(file), error: "" }));
    }
  }
  function handlePhotoChange(e) {
    const { name, value } = e.target;
    setPhotoForm((f) => ({ ...f, [name]: value, error: "" }));
  }
  function handleSubmitPhoto(e, isAddMemory) {
    e.preventDefault();
    if (!photoForm.photo || !photoForm.caption.trim() || !photoForm.date.trim()) {
      setPhotoForm(f => ({ ...f, error: "All fields including photo are required." }));
      return;
    }
    setPhotos(prev => [
      { photoURL: photoForm.photoURL, caption: photoForm.caption, date: photoForm.date, id: Date.now() },
      ...prev
    ]);
    // If inside Add Memory, also auto fill that photo to memory form
    if (isAddMemory) {
      setMemoryForm(f => ({
        ...f,
        photo: photoForm.photo,
        photoURL: photoForm.photoURL,
      }));
    }
    closeModal();
  }

  // --- ADD MILESTONE FORM ---
  function handleMilestoneChange(e) {
    const { name, value } = e.target;
    setMilestoneForm((f) => ({ ...f, [name]: value, error: "" }));
  }
  function handleSubmitMilestone(e) {
    e.preventDefault();
    if (!milestoneForm.title.trim() || !milestoneForm.date.trim() || !milestoneForm.description.trim()) {
      setMilestoneForm(f => ({ ...f, error: "All fields are required." }));
      return;
    }
    setMilestones(prev => [
      {
        title: milestoneForm.title,
        date: milestoneForm.date,
        description: milestoneForm.description,
        id: Date.now()
      },
      ...prev
    ]);
    closeModal();
  }

  // ---- MAIN CONTENT by NAV ----
  function renderSection() {
    switch (nav) {
      case "Timeline":
        return (
          <TimelineSection
            memories={memories}
            onAddMemoryClick={() => setModal("addMemory")}
          />
        );
      case "AddMemory":
        return (
          <AddMemorySection
            form={memoryForm}
            onChange={handleMemoryChange}
            onPhotoChange={handleMemoryPhotoChange}
            onUploadPhotoClick={() => setModal("uploadPhotoAddMemory")}
            onSubmit={handleSubmitMemory}
          />
        );
      case "Photos":
        return (
          <PhotosSection
            photos={photos}
            form={photoForm}
            onPhotoChange={handlePhotoPhotoChange}
            onChange={handlePhotoChange}
            onUploadPhotoClick={() => setModal("uploadPhotoPhotos")}
            onSubmit={(e) => handleSubmitPhoto(e, false)}
          />
        );
      case "Milestones":
        return (
          <MilestonesSection
            milestones={milestones}
            onAddMilestoneClick={() => setModal("addMilestone")}
          />
        );
      case "Scrapbook":
        return (
          <ScrapbookSection
            memories={memories}
            photos={photos}
            milestones={milestones}
          />
        );
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

  // Generic Modal component (renders children inside)
  function SimpleModal({ isOpen, title, children, onClose }) {
    if (!isOpen) return null;
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(38,50,68,0.31)", zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <div style={{
          background: "#fffefa", borderRadius: 12, minWidth: 280, maxWidth: "95vw",
          boxShadow: "0 4px 32px 0 rgba(0,0,0,0.12)", padding: 32, position: "relative"
        }}>
          <button
            style={{ position: "absolute", right: 16, top: 10, background: "none", border: "none", fontSize: 24, color: "#F67280", cursor: "pointer" }}
            aria-label="Close Modal"
            onClick={onClose}
            tabIndex={0}
          >×</button>
          <h2 style={{ marginTop: 0, marginBottom: 12, color: "#A1C6EA" }}>{title}</h2>
          {children}
        </div>
      </div>
    );
  }

  // --- MAIN RETURN (Layout + Modals) ---
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

      {/* --- ADD MEMORY MODAL --- */}
      <SimpleModal
        isOpen={modal === "addMemory"}
        title="Add Memory"
        onClose={closeModal}
      >
        <form onSubmit={handleSubmitMemory}>
          <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
            <label>
              Title<br/>
              <input
                name="title"
                type="text"
                value={memoryForm.title}
                onChange={handleMemoryChange}
                style={{ width: "94%", marginBottom: 8 }}
                required
                maxLength={60}
              />
            </label>
            <br/>
            <label>
              Date<br/>
              <input
                name="date"
                type="date"
                value={memoryForm.date}
                onChange={handleMemoryChange}
                required
                style={{ width: "65%", marginBottom: 8 }}
              />
            </label>
            <br/>
            <label>
              Story<br/>
              <textarea
                name="story"
                value={memoryForm.story}
                onChange={handleMemoryChange}
                required
                rows={4}
                style={{ width: "96%", maxWidth: 430, fontSize: "1rem", marginBottom: 8 }}
                maxLength={900}
                placeholder="Describe your memory in detail…"
              />
            </label>
            <br/>
            {memoryForm.photoURL && (
              <div>
                <img src={memoryForm.photoURL} alt="Selected" style={{ width: 80, borderRadius: 6, marginBottom: 7 }} />
              </div>
            )}
            <label style={{fontSize:"0.98rem"}}>
              Attach a photo (optional): <br/>
              <input
                name="photo"
                type="file"
                accept="image/*"
                onChange={handleMemoryPhotoChange}
                style={{margin: "6px 0"}}
              />
              <button
                type="button"
                className="pmv-accent-btn"
                onClick={() => setModal("uploadPhotoAddMemory")}
                style={{ marginLeft: 7, fontSize: "0.98rem" }}
              >
                Upload New Photo
              </button>
            </label>
            {memoryForm.error && (
              <div style={{color: "#b01233", margin: "8px 0"}}>{memoryForm.error}</div>
            )}
            <div style={{marginTop:16}}>
              <button className="pmv-primary-btn" type="submit">Save Memory</button>
              <button className="pmv-btn" type="button" onClick={closeModal}>Cancel</button>
            </div>
          </fieldset>
        </form>
      </SimpleModal>

      {/* --- PHOTO UPLOAD MODALS (Add Memory & Photos) --- */}
      <SimpleModal
        isOpen={modal === "uploadPhotoAddMemory"}
        title="Upload Photo"
        onClose={closeModal}
      >
        {/* Upload for Add Memory - After upload, fills image in memory form */}
        <form onSubmit={e => handleSubmitPhoto(e, true)}>
          <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
            <label>
              Photo File<br/>
              <input
                name="photo"
                type="file"
                accept="image/*"
                required
                onChange={handlePhotoPhotoChange}
              />
            </label>
            <br/>
            {photoForm.photoURL && (
              <img src={photoForm.photoURL} alt="Preview" style={{ width: 110, margin: 7, borderRadius: 6 }}/>
            )}
            <label>
              Caption<br />
              <input
                name="caption"
                type="text"
                value={photoForm.caption}
                onChange={handlePhotoChange}
                maxLength={80}
                required
                style={{ width: "95%" }}
              />
            </label>
            <br/>
            <label>
              Date<br/>
              <input
                name="date"
                type="date"
                value={photoForm.date}
                onChange={handlePhotoChange}
                required
                style={{ width: "70%" }}
              />
            </label>
            {photoForm.error && (
              <div style={{color: "#b01233", margin: "8px 0"}}>{photoForm.error}</div>
            )}
            <div style={{marginTop:12}}>
              <button className="pmv-accent-btn" type="submit">Save Photo</button>
              <button className="pmv-btn" type="button" onClick={closeModal}>Cancel</button>
            </div>
          </fieldset>
        </form>
      </SimpleModal>

      <SimpleModal
        isOpen={modal === "uploadPhotoPhotos"}
        title="Upload Photo"
        onClose={closeModal}
      >
        {/* Upload for Photos tab */}
        <form onSubmit={e => handleSubmitPhoto(e, false)}>
          <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
            <label>
              Photo File<br/>
              <input
                name="photo"
                type="file"
                accept="image/*"
                required
                onChange={handlePhotoPhotoChange}
              />
            </label>
            <br/>
            {photoForm.photoURL && (
              <img src={photoForm.photoURL} alt="Preview" style={{ width: 110, margin: 7, borderRadius: 6 }}/>
            )}
            <label>
              Caption<br />
              <input
                name="caption"
                type="text"
                value={photoForm.caption}
                onChange={handlePhotoChange}
                maxLength={80}
                required
                style={{ width: "95%" }}
              />
            </label>
            <br/>
            <label>
              Date<br/>
              <input
                name="date"
                type="date"
                value={photoForm.date}
                onChange={handlePhotoChange}
                required
                style={{ width: "70%" }}
              />
            </label>
            {photoForm.error && (
              <div style={{color: "#b01233", margin:"8px 0"}}>{photoForm.error}</div>
            )}
            <div style={{marginTop:12}}>
              <button className="pmv-accent-btn" type="submit">Save Photo</button>
              <button className="pmv-btn" type="button" onClick={closeModal}>Cancel</button>
            </div>
          </fieldset>
        </form>
      </SimpleModal>

      {/* --- ADD MILESTONE MODAL --- */}
      <SimpleModal
        isOpen={modal === "addMilestone"}
        title="Add Milestone"
        onClose={closeModal}
      >
        <form onSubmit={handleSubmitMilestone}>
          <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
            <label>
              Title<br/>
              <input
                name="title"
                type="text"
                value={milestoneForm.title}
                onChange={handleMilestoneChange}
                required
                maxLength={60}
                style={{ width: "94%", marginBottom: 8 }}
              />
            </label>
            <br/>
            <label>
              Date<br/>
              <input
                name="date"
                type="date"
                value={milestoneForm.date}
                onChange={handleMilestoneChange}
                required
                style={{ width: "65%", marginBottom: 8 }}
              />
            </label>
            <br/>
            <label>
              Description<br/>
              <textarea
                name="description"
                value={milestoneForm.description}
                onChange={handleMilestoneChange}
                required
                rows={3}
                maxLength={250}
                style={{ width: "95%", marginBottom: 10 }}
                placeholder="Describe this milestone…"
              />
            </label>
            {milestoneForm.error && (
              <div style={{color: "#b01233", margin: "8px 0"}}>{milestoneForm.error}</div>
            )}
            <div style={{marginTop:14}}>
              <button className="pmv-secondary-btn" type="submit">Save Milestone</button>
              <button className="pmv-btn" type="button" onClick={closeModal}>Cancel</button>
            </div>
          </fieldset>
        </form>
      </SimpleModal>
    </div>
  );
}

/* -----------------------------------------------
   TIMELINE SECTION (show memories)
-------------------------------------------------*/
function TimelineSection({ memories, onAddMemoryClick }) {
  return (
    <section className="pmv-section">
      <h2>Timeline</h2>
      <button className="pmv-primary-btn" onClick={onAddMemoryClick}>+ Add Memory</button>
      <div className="pmv-card-list">
        {memories.length === 0
          ? <div className="pmv-card pmv-card-empty">No memories yet.</div>
          : memories.map(mem => (
              <div className="pmv-card" key={mem.id}>
                <div style={{fontWeight:700, fontSize:"1.15rem", color:"#F67280"}}>{mem.title}</div>
                <div style={{fontSize:"0.96rem", color:"#8c97a8"}}>{mem.date}</div>
                {mem.photoURL && (
                  <div>
                    <img src={mem.photoURL} alt="Memory" style={{width:100,margin:"11px 0",borderRadius:8}}/>
                  </div>
                )}
                <div style={{marginTop:6,marginBottom:2}}>{mem.story}</div>
              </div>
          ))
        }
      </div>
    </section>
  );
}

/* -----------------------------------------------
   ADD MEMORY SECTION (main section, not modal)
-------------------------------------------------*/
function AddMemorySection({ form, onChange, onPhotoChange, onUploadPhotoClick, onSubmit }) {
  return (
    <section className="pmv-section">
      <h2>Add a Memory</h2>
      <form onSubmit={onSubmit}>
        <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
          <label>
            Title<br/>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={onChange}
              required
              maxLength={60}
              style={{ width: "95%", marginBottom: 8 }}
            />
          </label>
          <br/>
          <label>
            Date<br/>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={onChange}
              required
              style={{ width: "70%", marginBottom: 8 }}
            />
          </label>
          <br/>
          <label>
            Story<br/>
            <textarea
              name="story"
              value={form.story}
              onChange={onChange}
              required
              rows={4}
              style={{ width: "97%", maxWidth: 440, marginBottom: 8 }}
              maxLength={900}
              placeholder="Describe your memory in detail…"
            />
          </label>
          <br/>
          {form.photoURL && (
            <div>
              <img src={form.photoURL} alt="Selected" style={{ width: 80, borderRadius: 6, marginBottom: 7 }} />
            </div>
          )}
          <label style={{fontSize:"0.98rem"}}>
            Attach a photo (optional): <br/>
            <input
              name="photo"
              type="file"
              accept="image/*"
              onChange={onPhotoChange}
              style={{margin: "6px 0"}}
            />
            <button
              type="button"
              className="pmv-accent-btn"
              onClick={onUploadPhotoClick}
              style={{ marginLeft: 7, fontSize: "0.98rem" }}
            >
              Upload New Photo
            </button>
          </label>
          {form.error && (
            <div style={{color: "#b01233", margin: "8px 0"}}>{form.error}</div>
          )}
          <div style={{marginTop:15}}>
            <button className="pmv-primary-btn" type="submit">Save Memory</button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}

/* -----------------------------------------------
   PHOTOS SECTION
-------------------------------------------------*/
function PhotosSection({ photos, form, onPhotoChange, onChange, onUploadPhotoClick, onSubmit }) {
  return (
    <section className="pmv-section">
      <h2>Photos</h2>
      <button className="pmv-accent-btn" onClick={onUploadPhotoClick}>Upload Photo</button>
      <form onSubmit={onSubmit} style={{marginTop:18,marginBottom:20}}>
        <fieldset style={{border:"none",padding:0,margin:0}}>
          <label>
            Photo File<br/>
            <input
              name="photo"
              type="file"
              accept="image/*"
              onChange={onPhotoChange}
              required
            />
          </label>
          <br/>
          {form.photoURL && (
            <img src={form.photoURL} alt="Preview" style={{ width: 90, borderRadius: 6, marginTop: 7 }}/>
          )}
          <label>
            Caption<br/>
            <input
              name="caption"
              type="text"
              value={form.caption}
              onChange={onChange}
              required
              style={{ width: "92%" }}
              maxLength={80}
            />
          </label>
          <br/>
          <label>
            Date<br/>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={onChange}
              required
              style={{ width: "70%" }}
            />
          </label>
          {form.error && (
            <div style={{color: "#b01233", margin: "7px 0"}}>{form.error}</div>
          )}
          <div style={{marginTop:10}}>
            <button className="pmv-accent-btn" type="submit">Save Photo</button>
          </div>
        </fieldset>
      </form>
      <div className={photos.length === 0 ? "pmv-photo-grid pmv-photo-grid-empty" : "pmv-photo-grid"}>
        {photos.length === 0
          ? "No photos uploaded."
          : photos.map((photo) => (
              <div key={photo.id} style={{ background: "#fffefa", borderRadius: 10, boxShadow: "0 1px 8px #efdcb932", padding: 7 }}>
                <img src={photo.photoURL} alt="Pet" style={{ width: "100%", borderRadius: 7, objectFit:"cover", maxHeight:127 }}/>
                <div style={{color:"#F67280", fontWeight:"500", fontSize:"1.01rem", marginTop:3}}>
                  {photo.caption}
                </div>
                <div style={{color:"#A1C6EA", fontSize:".97rem"}}>{photo.date}</div>
              </div>
          ))
        }
      </div>
    </section>
  );
}

/* -----------------------------------------------
   MILESTONES SECTION
-------------------------------------------------*/
function MilestonesSection({ milestones, onAddMilestoneClick }) {
  return (
    <section className="pmv-section">
      <h2>Milestones</h2>
      <button className="pmv-secondary-btn" onClick={onAddMilestoneClick}>Add Milestone</button>
      <ul className={milestones.length === 0 ? "pmv-milestone-list pmv-milestone-list-empty" : "pmv-milestone-list"} style={{marginTop:19}}>
        {milestones.length === 0
          ? <li>No milestones added yet.</li>
          : milestones.map((ms) => (
              <li key={ms.id} style={{marginBottom:16, background:"#faf6f2", borderRadius:6, padding:"7px 13px", border:"1px solid #efdcb9"}}>
                <div style={{fontWeight:700, color:"#A1C6EA", fontSize:"1.08rem"}}>{ms.title}</div>
                <div style={{color:"#8c97a8", fontSize:"0.95rem"}}>{ms.date}</div>
                <div style={{marginTop:3, color:"#263244"}}>{ms.description}</div>
              </li>
          ))
        }
      </ul>
    </section>
  );
}

/* -----------------------------------------------
   SCRAPBOOK SECTION (collates everything together)
-------------------------------------------------*/
function ScrapbookSection({ memories, photos, milestones }) {
  return (
    <section className="pmv-section">
      <h2>Digital Scrapbook</h2>
      <p>Your printable, auto-updating scrapbook including all photos and milestones.</p>
      <button className="pmv-primary-btn disabled">Print Scrapbook</button>
      <div className="pmv-scrapbook-preview" style={{marginTop:24, background:"#fffefa"}}>
        {memories.length === 0 && photos.length === 0 && milestones.length === 0
          ? <span className="pmv-scrapbook-preview-empty">Scrapbook entries will appear here.</span>
          : (
            <div style={{width:"100%", textAlign:"left"}}>
              <h3 style={{color:"#A1C6EA", marginTop:0}}>Memories</h3>
              {memories.length === 0
                ? <div style={{color:"#8c97a8", fontStyle:"italic"}}>No memories yet.</div>
                : memories.map(m => (
                    <div key={m.id} style={{marginBottom:10}}>
                      <div style={{fontWeight:600, color:"#F67280"}}>{m.title}</div>
                      <div style={{fontSize:"0.97rem", color:"#8c97a8"}}>{m.date}</div>
                      <div style={{marginTop:3}}>{m.story}</div>
                      {m.photoURL && (
                        <div>
                          <img src={m.photoURL} alt="Scrap" style={{width:68, borderRadius:6, margin:"5px 0"}}/>
                        </div>
                      )}
                    </div>
                ))
              }
              <h3 style={{color:"#A1C6EA", marginBottom:0}}>Photos</h3>
              {photos.length === 0
                ? <div style={{color:"#8c97a8", fontStyle:"italic"}}>No photos uploaded.</div>
                : photos.map(p => (
                    <div key={p.id} style={{marginBottom:9}}>
                      <img src={p.photoURL} alt={p.caption} style={{width:74, borderRadius:6}}/>
                      <span style={{marginLeft:6, color:"#263244"}}>{p.caption}</span>
                    </div>
                ))
              }
              <h3 style={{color:"#A1C6EA", marginBottom:0}}>Milestones</h3>
              {milestones.length === 0
                ? <div style={{color:"#8c97a8", fontStyle:"italic"}}>No milestones yet.</div>
                : milestones.map(ms => (
                    <div key={ms.id} style={{marginBottom:8}}>
                      <div style={{fontWeight:600, color:"#A1C6EA"}}>{ms.title}</div>
                      <div style={{fontSize:".96rem", color:"#8c97a8"}}>{ms.date}</div>
                      <div style={{marginTop:2}}>{ms.description}</div>
                    </div>
                ))
              }
            </div>
          )
        }
      </div>
    </section>
  );
}

/* -----------------------------------------------
   SHARE STORY PLACEHOLDER (unchanged)
-------------------------------------------------*/
// PUBLIC_INTERFACE
function ShareStoryPlaceholder() {
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
