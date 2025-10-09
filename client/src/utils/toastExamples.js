// Toast Notification Examples and Usage Guide

/*
 * TOAST NOTIFICATIONS - QUICK REFERENCE
 * =====================================
 *
 * This guide shows you how to add toast notifications throughout your app.
 */

// 1. Import the required components
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 2. Add ToastContainer to your component's JSX (usually at the top level)
function MyComponent() {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
      {/* Your component content */}
    </div>
  );
}

// 3. Use toast notifications in your functions

// SUCCESS EXAMPLES
// ================

// Post created successfully
toast.success("🎉 Post created successfully!", {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

// Post updated
toast.success("✅ Post updated successfully!", {
  position: "top-right",
  autoClose: 3000,
});

// Post deleted
toast.success("🗑️ Post deleted successfully!", {
  position: "top-right",
  autoClose: 2000,
});

// Link copied
toast.success("📋 Link copied to clipboard!", {
  position: "top-right",
  autoClose: 2000,
});

// Shared successfully
toast.success("📤 Shared successfully!", {
  position: "top-right",
  autoClose: 2000,
});

// Comment added
toast.success("💬 Comment added successfully!", {
  position: "top-right",
  autoClose: 2000,
});

// Bookmarked
toast.success("🔖 Post bookmarked!", {
  position: "top-right",
  autoClose: 2000,
});

// Followed user
toast.success("👥 Now following user!", {
  position: "top-right",
  autoClose: 2000,
});

// ERROR EXAMPLES
// ==============

// Post creation failed
toast.error("❌ Failed to create post. Please try again.", {
  position: "top-right",
  autoClose: 4000,
});

// Not authenticated
toast.error("❌ You are not authenticated. Please log in.", {
  position: "top-right",
  autoClose: 4000,
});

// Update failed
toast.error("❌ Failed to update post. Please try again.", {
  position: "top-right",
  autoClose: 4000,
});

// Delete failed
toast.error("❌ Failed to delete post. Please try again.", {
  position: "top-right",
  autoClose: 4000,
});

// Network error
toast.error("🌐 Network error. Please check your connection.", {
  position: "top-right",
  autoClose: 5000,
});

// INFO EXAMPLES
// =============

// Processing
toast.info("⏳ Processing your request...", {
  position: "top-right",
  autoClose: 2000,
});

// Upload progress
toast.info("📤 Uploading images...", {
  position: "top-right",
  autoClose: false, // Manual dismiss
});

// WARNING EXAMPLES
// ================

// File size warning
toast.warning("⚠️ File size is too large. Maximum 10MB.", {
  position: "top-right",
  autoClose: 4000,
});

// Maximum images warning
toast.warning("⚠️ Maximum 3 images allowed.", {
  position: "top-right",
  autoClose: 3000,
});

// CUSTOM POSITIONS
// ================

// Top center
toast.success("Message", { position: "top-center" });

// Bottom right
toast.success("Message", { position: "bottom-right" });

// Bottom center
toast.success("Message", { position: "bottom-center" });

// Bottom left
toast.success("Message", { position: "bottom-left" });

// Top left
toast.success("Message", { position: "top-left" });

// ADVANCED USAGE
// ==============

// Toast with custom duration
toast.success("Quick message", { autoClose: 1000 }); // 1 second

// Toast that doesn't auto-close
toast.info("Manual dismiss", { autoClose: false });

// Toast with callback
toast.success("Action complete", {
  onClose: () => console.log("Toast closed"),
});

// Loading toast that updates
const toastId = toast.loading("Processing...");
// Later, update it:
toast.update(toastId, {
  render: "✅ Done!",
  type: "success",
  isLoading: false,
  autoClose: 3000,
});

// PROMISE-BASED TOAST
// ===================

const myPromise = fetch("/api/posts");

toast.promise(myPromise, {
  pending: "Loading...",
  success: "Post loaded! 👌",
  error: "Failed to load 🤯",
});

// CUSTOM STYLE
// ============

toast.success("Custom styled toast", {
  style: {
    background: "#333",
    color: "#fff",
  },
  progressStyle: {
    background: "#ff6b35",
  },
});

// EXAMPLE: Complete form submission with toast
// =============================================

const handleSubmit = async (formData) => {
  try {
    // Show loading toast
    const toastId = toast.loading("Creating post...");

    // Make API call
    const response = await api.post("/api/posts", formData);

    // Update toast to success
    toast.update(toastId, {
      render: "🎉 Post created successfully!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });

    // Navigate after delay
    setTimeout(() => navigate("/home"), 500);
  } catch (error) {
    // Show error toast
    toast.error("❌ Failed to create post. Please try again.", {
      position: "top-right",
      autoClose: 4000,
    });
  }
};

// BEST PRACTICES
// ==============

/*
1. Use emojis for visual appeal and quick recognition
2. Keep messages short and clear
3. Use appropriate toast types (success, error, info, warning)
4. Set longer autoClose for errors (users need more time to read)
5. Set shorter autoClose for quick actions (copy, like, etc.)
6. Add slight delay before navigation to show toast
7. Use consistent positioning (top-right recommended)
8. Don't overuse toasts - only for important feedback
9. Consider user actions: success = confirmation, error = retry info
10. Test on mobile devices for responsiveness
*/

// EMOJI REFERENCE
// ===============

/*
✅ - Success, completed, done
❌ - Error, failed, denied
⚠️ - Warning, caution
🎉 - Celebration, achievement
🗑️ - Delete, remove
📋 - Copy, clipboard
📤 - Upload, share, send
💬 - Comment, message
🔖 - Bookmark, save
👥 - Follow, user, people
⏳ - Processing, loading, wait
🌐 - Network, internet
📁 - File, folder
🖼️ - Image, photo
✏️ - Edit, modify
🔒 - Lock, secure, private
🔓 - Unlock, public
⭐ - Favorite, star, rating
💡 - Idea, tip, suggestion
🚀 - Launch, deploy, fast
*/
