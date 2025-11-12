/**
 * Newspaper Layout Image Extraction
 * Automatically extracts images from article content and moves them to the images column
 */

(function() {
  'use strict';

  // Only run on pages with newspaper layout
  const newspaperLayout = document.querySelector('.newspaper-layout');
  if (!newspaperLayout) return;

  const articleContent = document.querySelector('.article-content');
  const imagesColumn = document.querySelector('.newspaper-images-column');
  
  if (!articleContent || !imagesColumn) return;

  // Find all images in the article content
  const images = articleContent.querySelectorAll('img');
  
  images.forEach(function(img) {
    // Create a wrapper div to preserve spacing
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'newspaper-image-wrapper';
    
    // Clone the image
    const clonedImg = img.cloneNode(true);
    
    // Preserve alt text if it exists
    if (img.alt) {
      clonedImg.alt = img.alt;
    }
    
    // Append cloned image to wrapper
    imageWrapper.appendChild(clonedImg);
    
    // Append wrapper to images column
    imagesColumn.appendChild(imageWrapper);
    
    // Remove the original image's parent paragraph if it only contains the image
    const parent = img.parentElement;
    if (parent && parent.tagName === 'P') {
      const textContent = parent.textContent.trim();
      // Check if paragraph only contains the image (or whitespace)
      if (textContent === '' || (textContent === img.alt && parent.children.length === 1)) {
        parent.remove();
      } else {
        // Otherwise just remove the image
        img.remove();
      }
    } else {
      // If not in a paragraph, just remove the image
      img.remove();
    }
  });
})();

