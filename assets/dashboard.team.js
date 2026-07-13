import "dashboard";

function showAddAgentModal() {
    const el = document.getElementById('addAgentModal');
    if (el) {
        const modal = new bootstrap.Modal(el);
        modal.show();
    }
}

async function removeAgent(userId, userName, el) {
    if (confirm(`Are you sure you want to remove ${userName} from this workspace?`)) {
        try {
            const response = await fetch("/users", {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "App-Csrf-Token": document.querySelector("meta[name=\"ajax-csrf-token\"]")?.getAttribute("content") ?? null
                },
                body: JSON.stringify({
                    userId: userId,
                    userName: userName
                })
            });

            const responseJson = await response.json();

            if (!responseJson.ok) {
                const errorMsg = responseJson?.message ?? "An error occurred when processing user deletion";
                console.error(errorMsg);
                showToast(errorMsg, "error");
                return;
            }

            el.closest(".list-group-item").remove();

            showToast(`${userName} has been removed from this workspace.`, "success");
        } catch (error) {
            const errorMsg = `Error: ${error.message}`;
            console.error(errorMsg);
            showToast(errorMsg, "error");
        }
    }
}

window.showAddAgentModal = showAddAgentModal;
window.removeAgent = removeAgent;
