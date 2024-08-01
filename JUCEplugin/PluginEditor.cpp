/*
  ==============================================================================

    This file contains the basic framework code for a JUCE plugin editor.

  ==============================================================================
*/

#include "PluginProcessor.h"
#include "PluginEditor.h"

//==============================================================================
CompSoundHW4AudioProcessorEditor::CompSoundHW4AudioProcessorEditor (CompSoundHW4AudioProcessor& p)
    : AudioProcessorEditor (&p), audioProcessor (p)
{
   
    
    GainSlider.setSliderStyle(juce::Slider::SliderStyle::LinearHorizontal);
    GainSlider.setRange(0.0f, 1.0f, 0.01f);
    GainSlider.setValue(0.5f);
    GainSlider.addListener(this);
    addAndMakeVisible(GainSlider);

    pitchbutton.addListener(this);
    
    addAndMakeVisible(pitchbutton);
    

    pitchbutton.onClick = [this] {updateToggleState(&pitchbutton, "pitchShift");   };
    setSize (400, 300);
}

CompSoundHW4AudioProcessorEditor::~CompSoundHW4AudioProcessorEditor()
{
}

//==============================================================================
void CompSoundHW4AudioProcessorEditor::paint (juce::Graphics& g)
{
    // (Our component is opaque, so we must completely fill the background with a solid colour)
    g.fillAll (juce::Colours::black);


}

void CompSoundHW4AudioProcessorEditor::resized()
{
    
    GainSlider.setBounds(getWidth()/2-100,getHeight()/2-75, 200, 150);
    pitchbutton.setBounds(getWidth()/2-100, getHeight()/2 , 200, 150);
}

void CompSoundHW4AudioProcessorEditor::sliderValueChanged(juce::Slider *slider)
{
    
    if (slider==&GainSlider)
    {
        audioProcessor.mGain = GainSlider.getValue();
    }
}

void CompSoundHW4AudioProcessorEditor::updateToggleState(juce::Button* button, juce::String name)
{
    auto state = button->getToggleState();

    audioProcessor.click = (state ? 1 : 0);

    

}