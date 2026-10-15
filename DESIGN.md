---
name: Isola
description: A sunlit miniature world with quiet creation tools.
colors:
  forest: "#315e46"
  forest-ink: "#334a3c"
  olive-ink: "#657257"
  ivory: "#f8f9f3"
  leaf-surface: "#e9efdb"
  sea: "#badedc"
  divider: "#e9ebe2"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "35px"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-1.1px"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "21px"
    fontWeight: 400
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "11px"
    fontWeight: 500
rounded:
  control: "7px"
  card: "10px"
  panel: "14px"
spacing:
  tight: "7px"
  small: "10px"
  medium: "20px"
  large: "30px"
components:
  button-primary:
    backgroundColor: "#3b6449"
    textColor: "#f6f8ec"
    rounded: "{rounded.control}"
    padding: "13px 17px"
  button-primary-hover:
    backgroundColor: "#2f523b"
  tool-selected:
    backgroundColor: "{colors.leaf-surface}"
    textColor: "#466447"
---

# Design System: Isola

## Overview

**Creative North Star: "The miniature island"**

The scene carries the visual richness. Small, warm controls sit around a sunlit model world, leaving room to watch it move. This describes the implemented direction; it is not a claim of fidelity to the unavailable reference recording.

**Key Characteristics:**

- Faceted, dimensional models with soft directional shadows.
- Forest ink and ivory controls beside a turquoise sea.
- Friendly serif titles and precise, compact sans-serif labels.

## Colors

Forest provides the main actions and identity. Ivory surfaces separate tools from the sea. Leaf surfaces identify active tools, while olive ink carries supporting text.

**The World Leads Rule.** Keep the strongest color variation in the scene; controls use the quieter palette.

## Typography

Fraunces provides the brand and titles. DM Sans provides controls, search, explanatory copy, and shortcuts. Both fonts are locally bundled. Desktop display type is larger than the in-world title; on phones the game title and scene remain visible above the collapsed creation palette.

## Layout

The desktop catalog is a fixed-width left column (304px, 270px on smaller desktops, 334px on larger displays). The scene fills the remaining viewport. Catalog content scrolls independently. Below 760px, the catalog becomes a bottom sheet and the scene fills the screen. At less than 600px scene width, the camera widens to fit the full island.

## Elevation & Depth

The scene uses true 3D lighting and shadows. Interface shadows separate floating tools from the sea, with the panel shadow `0 8px 30px #355c4220`. Catalog cards use a light border at rest.

## Shapes

Controls use gently rounded corners, compact stroke icons, and clear selected states. Floating panels are slightly softer than individual controls. Circle shapes are reserved for the island avatar, status indicators, and small add controls.

## Components

Creation cards use thumbnails rendered from the same models placed in the world. Selected cards use a green outline. Category tabs use an underline. The bottom toolbar keeps Explore, Place, Remove, and Pause together. Weather and settings open small local panels; only help and replacing the island use dialogs. All controls have named accessible actions and visible keyboard focus.

Placement creates an expanding ripple. Reduced-motion settings suppress this decoration and CSS animation. Animal motion is part of the simulation and can be paused independently.

## Do's and Don'ts

- **Do** keep the world visible during ordinary creation and inspection.
- **Do** use actual model thumbnails for new catalog entries.
- **Do** give changes clear feedback and preserve undo for placement and removal.
- **Don't** use decorative interface textures that compete with the island.
- **Don't** replace dimensional objects with static scenery images.
