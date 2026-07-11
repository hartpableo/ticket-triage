class AttachmentHandler {
    constructor(form) {
        this.form = form;
        
        // Find file input, prioritizing one with 'attachments' in its name
        this.fileInput = form.querySelector('input[type="file"][name*="attachments"]') || form.querySelector('input[type="file"]');
        
        // Find other control elements relative to the form
        this.previewContainer = form.querySelector(".attachment-preview-container") || form.querySelector("#attachment-preview-container");
        this.clearBtn = form.querySelector(".clear-attachments-btn") || form.querySelector("#clear-attachments-btn");
        
        // Find attachment trigger buttons relative to this form
        this.attachImgBtn = form.querySelector(".attach-image-btn") || form.querySelector('[onclick*="handleMediaAttachment(\'image\')"]');
        this.attachVidBtn = form.querySelector(".attach-video-btn") || form.querySelector('[onclick*="handleMediaAttachment(\'video\')"]');
        
        this.attachments = [];
        
        // Save instance on form element for reference
        this.form._attachmentHandler = this;
        
        if (this.fileInput && this.previewContainer) {
            this.init();
        }
    }
    
    init() {
        // Clear any inline onclick handlers to avoid duplicate triggers and conflicts
        if (this.attachImgBtn) {
            this.attachImgBtn.onclick = null;
            this.attachImgBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMediaAttachment('image');
            });
        }
        if (this.attachVidBtn) {
            this.attachVidBtn.onclick = null;
            this.attachVidBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMediaAttachment('video');
            });
        }
        if (this.clearBtn) {
            this.clearBtn.onclick = null;
            this.clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearAttachments();
            });
        }
        
        this.render();
    }
    
    syncFilesToForm() {
        try {
            const dataTransfer = new DataTransfer();
            this.attachments.forEach(item => {
                if (item.file) {
                    dataTransfer.items.add(item.file);
                }
            });
            this.fileInput.files = dataTransfer.files;
        } catch (err) {
            console.error("Failed to sync files to file input:", err);
        }
    }
    
    render() {
        if (!this.previewContainer) return;
        
        this.previewContainer.innerHTML = "";
        
        if (this.attachments.length === 0) {
            if (this.clearBtn) this.clearBtn.classList.add("d-none");
            return;
        }
        
        if (this.clearBtn) this.clearBtn.classList.remove("d-none");
        
        this.attachments.forEach((file, index) => {
            const card = document.createElement("div");
            card.className = "position-relative border rounded-3 p-1 bg-white shadow-sm";
            card.style.width = "70px";
            card.style.height = "70px";
            
            let thumbnailContent = "";
            if (file.type === "image") {
                thumbnailContent = `<img src="${file.url}" style="width: 100%; height: 100%; object-fit: cover;" class="rounded-2" alt="${file.name}">`;
            } else if (file.type === "video") {
                thumbnailContent = `<div class="w-100 h-100 bg-dark rounded-2 d-flex align-items-center justify-content-center text-white"><i class="bi bi-play-fill fs-4"></i></div>`;
            }
            
            card.innerHTML = `
                ${thumbnailContent}
                <button type="button" class="position-absolute top-0 end-0 btn btn-danger p-0 rounded-circle d-flex align-items-center justify-content-center"
                        style="width: 18px; height: 18px; transform: translate(30%, -30%); font-size: 0.65rem;"
                        title="Remove">
                  <i class="bi bi-x"></i>
                </button>
            `;
            
            const removeBtn = card.querySelector("button");
            if (removeBtn) {
                removeBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    this.removeAttachmentByIndex(index);
                });
            }
            
            this.previewContainer.appendChild(card);
        });
    }
    
    clearAttachments() {
        this.attachments.forEach(item => {
            if (item.url && item.url.startsWith("blob:")) {
                URL.revokeObjectURL(item.url);
            }
        });
        this.attachments = [];
        this.render();
        this.syncFilesToForm();
        if (typeof window.showToast === "function") {
            window.showToast("All attachments cleared.", "info");
        }
    }
    
    removeAttachmentByIndex(index) {
        const removed = this.attachments.splice(index, 1)[0];
        if (removed && removed.url && removed.url.startsWith("blob:")) {
            URL.revokeObjectURL(removed.url);
        }
        this.render();
        this.syncFilesToForm();
    }
    
    handleMediaAttachment(type) {
        const tempInput = document.createElement("input");
        tempInput.type = "file";
        tempInput.multiple = true;
        if (type === "image") {
            tempInput.accept = "image/*";
        } else if (type === "video") {
            tempInput.accept = "video/*";
        }
        
        tempInput.onchange = (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;
            
            files.forEach(file => {
                const duplicate = this.attachments.some(
                    item => item.file && item.file.name === file.name && item.file.size === file.size
                );
                if (duplicate) return;
                
                const fileUrl = URL.createObjectURL(file);
                this.attachments.push({
                    type: type,
                    url: fileUrl,
                    name: file.name,
                    file: file
                });
            });
            
            this.render();
            this.syncFilesToForm();
            if (typeof window.showToast === "function") {
                window.showToast(`${files.length} file(s) attached.`, "success");
            }
        };
        
        tempInput.click();
    }
}

// Auto-initialize handler on DOMContentLoaded or execution
function initAllAttachmentHandlers() {
    const forms = document.querySelectorAll("form");
    forms.forEach(form => {
        const previewContainer = form.querySelector(".attachment-preview-container") || form.querySelector("#attachment-preview-container");
        const fileInput = form.querySelector('input[type="file"]');
        if (previewContainer && fileInput) {
            if (!form.dataset.attachmentHandlerInitialized) {
                form.dataset.attachmentHandlerInitialized = "true";
                new AttachmentHandler(form);
            }
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllAttachmentHandlers);
} else {
    initAllAttachmentHandlers();
}

// Attach class and legacy window hooks for backward compatibility
window.AttachmentHandler = AttachmentHandler;

window.handleMediaAttachment = function (type) {
    console.warn("Global handleMediaAttachment is deprecated. Please use AttachmentHandler instance.");
    const forms = document.querySelectorAll('form[data-attachment-handler-initialized="true"]');
    if (forms.length > 0 && forms[0]._attachmentHandler) {
        forms[0]._attachmentHandler.handleMediaAttachment(type);
    }
};

window.clearAttachments = function () {
    console.warn("Global clearAttachments is deprecated. Please use AttachmentHandler instance.");
    const forms = document.querySelectorAll('form[data-attachment-handler-initialized="true"]');
    if (forms.length > 0 && forms[0]._attachmentHandler) {
        forms[0]._attachmentHandler.clearAttachments();
    }
};

window.removeAttachmentByIndex = function (index) {
    console.warn("Global removeAttachmentByIndex is deprecated. Please use AttachmentHandler instance.");
    const forms = document.querySelectorAll('form[data-attachment-handler-initialized="true"]');
    if (forms.length > 0 && forms[0]._attachmentHandler) {
        forms[0]._attachmentHandler.removeAttachmentByIndex(index);
    }
};
