# Implementation Plan - Hajj & Umrah Guide

This plan covers the implementation of **Sub-Module 13.1: Interactive Ritual Maps**.

## User Review Required

> [!IMPORTANT]
> - I will implement a **Step-by-Step progress tracker** for both Hajj and Umrah.
> - **Audio Integration**: I will use `expo-av` for audio playback. Since I don't have actual mp3 files, I will use high-quality text-to-speech URLs or placeholders that can be replaced with real assets.
> - **Offline Support**: Ritual descriptions and Dua texts will be stored locally in a JSON file.

## Proposed Changes

### Module 13.1: Interactive Ritual Maps

#### [rituals.json](file:///E:/node/super-app/mobile/src/assets/data/rituals.json) [NEW]
- Data structure containing the sequence of steps for Hajj and Umrah.
- Each step includes: title, description, Arabic Dua, translation, and audio URL placeholder.

#### [AudioGuidePlayer.jsx](file:///E:/node/super-app/mobile/src/components/AudioGuidePlayer.jsx) [NEW]
- A reusable component for playing Dua audio.
- Controls: Play/Pause, Progress Bar, Speed control (optional).

#### [guide.jsx](file:///E:/node/super-app/mobile/src/app/hajj/guide.jsx) [NEW]
- The main guide screen.
- Features:
    - Mode toggle: **Umrah** vs **Hajj**.
    - Vertical step indicator showing current progress.
    - Expandable cards for each ritual step.
    - Integrated `AudioGuidePlayer` for relevant steps.
    - "Mark as Complete" functionality to track progress.

#### [index.jsx](file:///E:/node/super-app/mobile/src/app/index.jsx)
- Add a "Hajj & Umrah Guide" button to the Home screen.

## Verification Plan

### Automated Tests
- Run `npm run lint` in the `mobile` workspace.

### Manual Verification
- Verify navigation from Home -> Hajj Guide.
- Test the Hajj/Umrah mode toggle and ensure steps update.
- Test the step expansion and "Mark Complete" logic.
- Verify audio player UI and basic playback functionality (with dummy URL).
- Check that all Dua text (Arabic/English) is rendered correctly.
