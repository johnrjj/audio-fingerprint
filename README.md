# audio-fingerprint
takes a 15 second audio sample and is able to identify it... almost done, subsets of songs are working, need to work on robustness when sets of songs get larger. work in progress, just a passion project when i have free time

most of the interesting stuff is located in /lib/

how it works:

stereo audio file -> merge streams into mono -> filter -> downsample -> more filtering (windowing functions) -> fast fourier transform -> combitorial hashing to get fingerprint of audio

note: if you really want to run it: npm start

if that breaks for some reason, typical webpack commands for the dev server
