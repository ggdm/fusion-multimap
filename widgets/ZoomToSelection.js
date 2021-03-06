/**
 * Fusion.Widget.ZoomToSelection
 *
 * $Id: ZoomToSelection.js 1523 2008-09-11 19:30:43Z pagameba $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.ZoomToSelection
 *
 * Zoom to the current selection, if any
 *
 * **********************************************************************/

Fusion.Widget.ZoomToSelection = OpenLayers.Class(Fusion.Widget, {
    uiClass: Jx.Button,
    
    initializeWidget: function(widgetTag) {

        var json = widgetTag.extension;
        this.maxDimension = json.MaximumZoomDimension ? json.MaximumZoomDimension[0] : -1;
        this.zoomFactor = json.ZoomFactor ? json.ZoomFactor[0] : 2;
 
        this.enable = Fusion.Widget.ZoomToSelection.prototype.enable;
        
        this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_ON, OpenLayers.Function.bind(this.enable, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_OFF, OpenLayers.Function.bind(this.disable, this));
    },

    /**
     * get the selection from the map (which may not be loaded yet).
     * zoomToSelection is called when the selection is ready.
     */
    activate: function() {
        this.getMap().getSelection(OpenLayers.Function.bind(this.zoomToSelection, this));
    },

    /**
     * set the extents of the map based on the pixel coordinates
     * passed
     * 
     * @param selection the active selection, or null if there is none
     */
    zoomToSelection : function(selection) {
        var map = this.oMap.aMaps[0]; //TODO: allow selection on multple maps
        var ll = selection[map.getMapName()].getLowerLeftCoord();
        var ur = selection[map.getMapName()].getUpperRightCoord();
        var zoom_size = this.zoomFactor * Math.max( Math.abs(ur.x - ll.x), Math.abs(ur.y - ll.y)) / 2;
        var cX = (ur.x + ll.x)/2;
        var cY = (ur.y + ll.y)/2;
        ll.x = cX - zoom_size;
        ur.x = cX + zoom_size;
        ll.y = cY - zoom_size;
        ur.y = cY + zoom_size;
        this.getMap().setExtents(new OpenLayers.Bounds(ll.x,ll.y,ur.x,ur.y));
    },
    
    enable: function() {
        if (this.oMap && this.oMap.hasSelection()) {
            Fusion.Widget.prototype.enable.apply(this, []);
        } else {
            this.disable();
        }
    }

});
