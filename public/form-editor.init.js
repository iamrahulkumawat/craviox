
  // Initialize Quill
  var quill = new Quill("#snow-editor", {
    theme: "snow",
    modules: {
      toolbar: [
        [{ font: [] }, { size: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "super" }, { script: "sub" }],
        [{ header: [1, 2, 3, 4, 5, 6] }, "blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["direction", { align: [] }],
        ["link", "image", "video"],
        ["clean"],
      ],
    },
  });

  // Override the default link handler to prompt for a link
  quill.getModule("toolbar").addHandler("link", () => {
    const url = prompt("Enter the URL:");
    if (url) {
      quill.format("link", url);
    }
  });

  // Override the default image handler to prompt for a link
  quill.getModule("toolbar").addHandler("image", () => {
    const url = prompt("Enter the URL of the image:");
    if (url) {
      const range = quill.getSelection();
      quill.insertEmbed(range.index, "image", url, Quill.sources.USER);
    }
  });

  // Initialize Quill for another editor if needed
  var bubbleQuill = new Quill("#bubble-editor", { theme: "bubble" });

