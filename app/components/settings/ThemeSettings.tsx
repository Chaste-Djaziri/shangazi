"use client";

export default function ThemeSettings() {
  return (
    <div className="theme-settings">
      <div className="theme-settings-header">
        <h2>Theme Settings</h2>
        <p>Your site color palette</p>
      </div>

      <div className="theme-settings-content">
        <div className="theme-colors-preview">
          <h3>Theme Colors</h3>
          <div className="color-palette">
            <div className="color-swatch">
              <div
                className="color-box"
                style={{ backgroundColor: "#1d5c19" }}
              />
              <span>Primary Green</span>
              <code>#1d5c19</code>
            </div>
            <div className="color-swatch">
              <div
                className="color-box"
                style={{ backgroundColor: "#be1d51" }}
              />
              <span>Accent Pink</span>
              <code>#be1d51</code>
            </div>
          </div>
        </div>

        <div className="theme-preview">
          <h3>Preview</h3>
          <div className="preview-card">
            <div className="preview-header">Card Header</div>
            <div className="preview-body">
              <p>This is how your theme colors look in action.</p>
              <button className="btn-primary">Primary Button</button>
              <button className="btn-accent">Accent Button</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

