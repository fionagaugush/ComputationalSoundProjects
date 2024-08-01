/*
  ==============================================================================

    This file contains the basic framework code for a JUCE plugin editor.

  ==============================================================================
*/

#pragma once

#include <JuceHeader.h>
#include "PluginProcessor.h"

//==============================================================================
/**
*/
class CompSoundHW4AudioProcessorEditor  : public juce::AudioProcessorEditor,
                                          public juce::Slider::Listener, 
                                          public juce::Button::Listener
{
public:
    CompSoundHW4AudioProcessorEditor (CompSoundHW4AudioProcessor&);
    ~CompSoundHW4AudioProcessorEditor() override;

    //==============================================================================
    void paint (juce::Graphics&) override;
    void resized() override;
    
    void sliderValueChanged(juce::Slider* slider) override;
    void updateToggleState(juce::Button* button, juce::String name);

    void buttonClicked(juce::Button* button) override {
        if (button == &pitchbutton) {
           
            audioProcessor.click=(pitchbutton.getToggleState() ? 1 : 0);
        }
    }


private:
    
    juce::Slider GainSlider;
    juce::ToggleButton pitchbutton{ "Pitch Shifting"};
    CompSoundHW4AudioProcessor& audioProcessor;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (CompSoundHW4AudioProcessorEditor)
};
