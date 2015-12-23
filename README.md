#DAYA

--work in progress-- 

an interactive website meant as accompaniment to music/video done in collaboration with [Sehyun Kim](http://www.kimsehyun.kr/) and [Cassie Tarakajian](https://github.com/catarak)

###[the video](https://vimeo.com/143033999)

##methodology

OBJ files are parsed using a node script (obj_converter) which turns each edge of the quad polygons into a rectangle composed of two triangles (see createTriStrip function)

when the page is loaded, two versions (open and closed mouth) are loaded and then 30 interpolated versions between these two states are generated on the front end

when a key is pressed the gl buffer data is cycled through

noise function is applied in the vertex shader to each vertex

a simple additive function is utilized in the fragment shader to try and match the brilliance of the original video

##key areas of improvement and feature addition

###add animation/mouse reaction

###improve performance of interpolation function
currently the interpolation function is performed on all elements in the array
a simple (I think) fix would be to apply it just to the vertices - have to experiment
also, since texture mapping is not interpolated in lattice construction, simple data compression could be implemented and reduce data size by ~15%

###better match rendered video
look into blending modes and see if I can improve

###add more audio 
with improved webgl performance hopefully I can add more notes and have better audio performance

###add web midi support for chrome

###make it work better
there's just plenty to be done to make this work better...

_______________________________________________

##Libraries

[AudioKeys](https://github.com/kylestetz/AudioKeys)
[Tonejs](http://tonejs.org/)

##Thanks to

Sehyun Kim for his 3D modeling and for letting us use his daughter
Cassie
Ken Perlin