/**
 * CE.SDK Vectorizer Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the vectorizer editor.
 * Import and call `initVectorizerEditor()` to configure a CE.SDK instance
 * with image vectorization functionality prominently featured.
 *
 * @see https://img.ly/docs/cesdk/js/plugins/vectorizer/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

// Configuration plugin
import { DesignEditorConfig } from './config/plugin';

// Vectorizer plugin
import { setupVectorizerPlugin } from './plugins/vectorizer';

// Re-export for external use
export { DesignEditorConfig } from './config/plugin';
export { setupVectorizerPlugin } from './plugins/vectorizer';

/**
 * Initialize the CE.SDK Vectorizer Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Design editor UI configuration
 * - Image vectorization via official plugin (canvas menu)
 * - Asset source plugins (templates, images, shapes, text, etc.)
 * - Actions dropdown in navigation bar
 * - Disabled placeholder and preview features
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initVectorizerEditor(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the design editor configuration plugin
  // This sets up the UI, features, settings, and i18n for design editing
  await cesdk.addPlugin(new DesignEditorConfig());

  // ============================================================================
  // Runtime Configuration
  // ============================================================================

  // Set role (replaces deprecated config.role)
  cesdk.engine.editor.setRole('Creator');

  // Set theme (replaces deprecated config.theme)
  cesdk.ui.setTheme('light');

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  // Color palettes for design
  await cesdk.addPlugin(new ColorPaletteAssetSource());

  // Typeface/font assets
  await cesdk.addPlugin(new TypefaceAssetSource());

  // Text presets (headlines, body text styles)
  await cesdk.addPlugin(new TextAssetSource());

  // Text components (pre-designed text layouts)
  await cesdk.addPlugin(new TextComponentAssetSource());

  // Vector shapes (rectangles, circles, arrows, etc.)
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // Sticker assets
  await cesdk.addPlugin(new StickerAssetSource());

  // Visual effects (adjustments, vignette, etc.)
  await cesdk.addPlugin(new EffectsAssetSource());

  // Photo filters (LUT, duotone)
  await cesdk.addPlugin(new FiltersAssetSource());

  // Blur presets for blur effects
  await cesdk.addPlugin(new BlurAssetSource());

  // Page format presets (A4, Letter, social media sizes)
  await cesdk.addPlugin(new PagePresetsAssetSource());

  // Crop presets (aspect ratios)
  await cesdk.addPlugin(new CropPresetsAssetSource());

  // Local upload sources (images) - replaces config.callbacks.onUpload
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );

  // Demo assets (templates, images)
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: [
        'ly.img.templates.blank.*',
        'ly.img.templates.presentation.*',
        'ly.img.templates.print.*',
        'ly.img.templates.social.*',
        'ly.img.image.*'
      ]
    })
  );

  // ============================================================================
  // Vectorizer Plugin
  // ============================================================================

  // Setup image vectorization with canvas menu
  // - Canvas menu: Adds "Vectorize" option when an image is selected
  // The vectorizer converts raster images into scalable vector graphics
  await setupVectorizerPlugin(cesdk);

  // ============================================================================
  // Feature Configuration
  // ============================================================================

  // Disable placeholder and preview features (matching original showcase)
  cesdk.feature.set('ly.img.placeholder', false);
  cesdk.feature.set('ly.img.preview', false);

  // ============================================================================
  // Navigation Bar Actions
  // ============================================================================

  // Configure the actions dropdown in the navigation bar
  // This replaces deprecated config.ui.elements.navigation.action.export
  cesdk.ui.insertOrderComponent(
    { in: 'ly.img.navigation.bar', position: 'end' },
    {
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.exportImage.navigationBar',
        'ly.img.exportPDF.navigationBar'
      ]
    }
  );

  // ============================================================================
  // Scene Loading
  // ============================================================================

  // Load the vectorizer demo scene from the public showcases URL
  // This scene contains an image optimized for demonstrating vectorization
  await cesdk.loadFromArchiveURL(
    'https://img.ly/showcases/cesdk/cases/vectorizer-plugin/scene.archive'
  );

  // ============================================================================
  // Editor Settings
  // ============================================================================

  // Hide page title (matching original showcase)
  cesdk.engine.editor.setSetting('page/title/show', false);

  // Select the image block for immediate vectorization demonstration
  const imageBlock = cesdk.engine.block.findByName('SelectedImage')[0];
  if (imageBlock) {
    cesdk.engine.block.select(imageBlock);
  }
}
