/**
 * CE.SDK Vectorizer Editor Starterkit - Main Entry Point
 *
 * A design editor with image vectorization for converting raster images to vectors.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initVectorizerEditor } from './imgly';
import { resolveAssetPath } from './imgly/resolveAssetPath';

// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-vectorizer-editor-user'

  // Local assets
  // baseURL: `/assets/`,

  // License key (required for production)
  // license: 'YOUR_LICENSE_KEY',
};

// ============================================================================
// Initialize Vectorizer Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Debug access (remove in production)
    (window as any).cesdk = cesdk;

    await initVectorizerEditor(cesdk);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load the vectorizer demo scene from the public showcases URL
    // This scene contains an image optimized for demonstrating vectorization
    await cesdk.loadFromArchiveURL(
      resolveAssetPath('/assets/scene.archive')
    );

    // Select the image block for immediate vectorization demonstration
    const imageBlock = cesdk.engine.block.findByName('SelectedImage')[0];
    if (imageBlock) {
      cesdk.engine.block.select(imageBlock);
    }
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
