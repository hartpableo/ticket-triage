let activeCommentAttachments = [];

function syncFilesToForm() {
    const form = document.querySelector("form[name=\"comment\"]");
    if (!form) return;

    const fileInput = form.querySelector("#comment_attachments");

    // Sync files to the input using DataTransfer
    try {
        const dataTransfer = new DataTransfer();
        activeCommentAttachments.forEach(item => {
            if (item.file) {
                dataTransfer.items.add(item.file);
            }
        });
        fileInput.files = dataTransfer.files;
    } catch (err) {
        console.error("Failed to sync files to file input:", err);
    }
}

function renderAttachmentPreviews() {
    const container = document.getElementById("attachment-preview-container");
    const clearBtn = document.getElementById("clear-attachments-btn");
    if (!container) return;

    container.innerHTML = "";

    if (activeCommentAttachments.length === 0) {
        if (clearBtn) clearBtn.classList.add("d-none");
        return;
    }

    if (clearBtn) clearBtn.classList.remove("d-none");

    activeCommentAttachments.forEach((file, index) => {
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
              onclick="removeAttachmentByIndex(${index})" title="Remove">
        <i class="bi bi-x"></i>
      </button>
    `;
        container.appendChild(card);
    });
}

function clearAttachments() {
    activeCommentAttachments.forEach(item => {
        if (item.url && item.url.startsWith("blob:")) {
            URL.revokeObjectURL(item.url);
        }
    });
    activeCommentAttachments = [];
    renderAttachmentPreviews();
    syncFilesToForm();
    showToast("All attachments cleared.", "info");
}

function removeAttachmentByIndex(index) {
    const removed = activeCommentAttachments.splice(index, 1)[0];
    if (removed && removed.url && removed.url.startsWith("blob:")) {
        URL.revokeObjectURL(removed.url);
    }
    renderAttachmentPreviews();
    syncFilesToForm();
}

function handleMediaAttachment(type) {
    const tempInput = document.createElement("input");
    tempInput.type = "file";
    tempInput.multiple = true;
    if (type === "image") {
        tempInput.accept = "image/*";
    } else if (type === "video") {
        tempInput.accept = "video/*";
    }

    tempInput.onchange = function (e) {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        files.forEach(file => {
            // Check if file is already added
            const duplicate = activeCommentAttachments.some(
                item => item.file && item.file.name === file.name && item.file.size === file.size
            );
            if (duplicate) return;

            const fileUrl = URL.createObjectURL(file);
            activeCommentAttachments.push({
                type: type,
                url: fileUrl,
                name: file.name,
                file: file
            });
        });

        renderAttachmentPreviews();
        syncFilesToForm();
        showToast(`${files.length} file(s) attached.`, "success");
    };

    tempInput.click();
}

window.handleMediaAttachment = handleMediaAttachment;
window.clearAttachments = clearAttachments;
window.removeAttachmentByIndex = removeAttachmentByIndex;
