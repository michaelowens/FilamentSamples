use <contrib/text_on.scad>

BRAND = "BambuLab";
BRAND_SIZE = 3.6;
COLOR_LINES = 2;
COLOR1 = "Rose Red";
COLOR2 = "& Light Blue";
COLOR3 = "";
COLORS = [COLOR1, COLOR2, COLOR3];
COLOR_SIZE = 4; // 3.4
FILAMENT = "PLA Silk";
FILAMENT_SIZE = 6;

BRAND_FONT = "Bahnschrift:style=Bold SemiCondensed";
COLOR_FONT = "Bahnschrift:style=Bold SemiCondensed";
//FILAMENT_FONT = "Bahnschrift:style=Bold SemiCondensed";


difference() {
    import("contrib/Sample+Plain.stl", convexity=4);
    
    // Front text (Filament)
    rotate([0,0,7])
    translate([-1.4,-.3,-0.5])
    text_on_cylinder(t=FILAMENT,size=FILAMENT_SIZE,spacing=1,locn_vec=[0,0,0],r=15.85,r1=undef,r2=undef,h=10);

    // Bottom Text (Brand & Color)
    rotate([0,180,180])
    translate([-1.4,0,-1]) // -1.4 centers on the model
    linear_extrude(height = 9) {
        union() {
            translate([0,9,0])
            text(BRAND, BRAND_SIZE, BRAND_FONT, halign="center", valign="center");
            
            PADDING = -1 + (max(0, COLOR_LINES - 1) * 3);
            for (i = [ 0 : COLOR_LINES - 1 ]) {
                translate([0,PADDING-(i*(COLOR_SIZE+2)),0])
                text(COLORS[i], COLOR_SIZE, COLOR_FONT, halign="center", valign="center");
            }
        }
    }
    
    // For test prints: remove top section
    //translate([-50,-50,8.7])
    //cube([100, 100, 80]);
}
