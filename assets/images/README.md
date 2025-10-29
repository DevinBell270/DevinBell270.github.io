# Images Directory

This directory stores images for blog posts. Organize images by creating a folder for each post using the format:

```
assets/images/YYYY-MM-DD-post-title/
```

## Example Structure

```
assets/images/
  ├── 2025-01-29-welcome/
  │   ├── sample-image.jpg
  │   └── another-photo.png
  └── 2025-02-15-fishing-trip/
      ├── trout.jpg
      └── lake-view.jpg
```

## Using Images in Posts

Reference images in your markdown posts like this:

```markdown
![Alt text]({{ '/assets/images/2025-01-29-welcome/sample-image.jpg' | relative_url }})
```

This keeps your images organized and makes it easy to manage assets for each blog post.

## Tips

- Keep image file sizes reasonable for faster page loads
- Use descriptive filenames
- Consider compressing images before uploading
- Store related images for a post in the same folder

