document.addEventListener("DOMContentLoaded", function () {
    // Live profile photo preview handler
    const photoInput = document.getElementById("profile-photo");
    if (photoInput) {
        photoInput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (file) {
                if (!file.type.startsWith("image/")) {
                    if (typeof showToast === "function") {
                        showToast("Please select a valid image file (PNG, JPG, WebP, GIF).", "error");
                    } else {
                        alert("Please select a valid image file (PNG, JPG, WebP, GIF).");
                    }
                    photoInput.value = "";
                    return;
                }
                // if (file.size > 3 * 1024 * 1024) {
                //     if (typeof showToast === "function") {
                //         showToast("Image file size must be less than 3MB.", "error");
                //     } else {
                //         alert("Image file size must be less than 3MB.");
                //     }
                //     photoInput.value = "";
                //     return;
                // }
                const reader = new FileReader();
                reader.onload = function (e) {
                    const previewEl = document.getElementById("profile-avatar-preview");
                    if (previewEl) {
                        previewEl.style.backgroundImage = `url('${e.target.result}')`;
                        previewEl.style.backgroundSize = "cover";
                        previewEl.style.backgroundPosition = "center";
                        previewEl.style.color = "transparent";
                        previewEl.style.textShadow = "none";
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

});
