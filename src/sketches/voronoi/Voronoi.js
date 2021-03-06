import Delaunator from "delaunator";

export default function Voronoi(p){
    // Globals
    const numPoints = 160;

    const numColumns = 16;
    const numRows = 10;

    let gridX = 0;
    let gridY = 0;

    // Magnitude of gravitational constant
    let gravityMag = 1;


    let seedPoints = [];
    let anchorPoints = [];

    let noiseSeedX = 0;
    let noiseSeedY = 0;
    let noiseIncrementX = 0;
    const noiseIncrementXMax = 0.01;
    let noiseIncrementY = 0;
    const noiseIncrementYMax = 0.01;
    const noiseMax = 10000;

    let lineColor = '#DEB841';


    const noiseOffset = 1;
    const pointWanderMaxSpeed = 0;
    const anchorMass = 1;
    const wandererMass = 0.1;


    // Initialization/reset and RNG
    function randomizeNoise() {
        noiseSeedX = p.random(noiseMax);
        noiseIncrementX = p.random(-noiseIncrementXMax, noiseIncrementXMax);

        noiseSeedY = p.random(noiseMax);
        noiseIncrementY = p.random(-noiseIncrementYMax, noiseIncrementYMax);
    }
    function incrementNoise() {
        noiseSeedX += noiseIncrementX;
        if(noiseSeedX > noiseMax || noiseSeedX < 0){
            noiseIncrementX = -noiseIncrementX;
        }

        noiseSeedY += noiseIncrementY;
        if(noiseSeedY > noiseMax || noiseSeedY < 0){
            noiseIncrementY = -noiseIncrementY;
        }
    }
    function newPoints() {
        seedPoints = [];
        anchorPoints = [];
        gridX = p.width / numColumns;
        gridY = p.height / numRows;

        // Divide canvas into grid for initial point selection
        for(let i = -2; i < numRows + 2; i++){
            for(let j = -2; j < numColumns + 2; j++){
                const x = p.random(j * gridX, (j+1) * gridX);
                const y = p.random(i * gridY, (i+1) * gridY);
                anchorPoints.push([x, y]);
                seedPoints.push([x, y]);
            }
        }

        // Pure random initial point selection
        // for(let i = 0; i < numPoints; i++){
        //     const x = p.random(p.width);
        //     const y = p.random(p.height);
        //     anchorPoints.push([x, y]);
        //     seedPoints.push([x, y]);
        // }
    }


    // Helper functions for manipulating Delaunator object
    function triangleOfEdge(e)  { return Math.floor(e / 3); }
    function nextHalfedge(e) { return (e % 3 === 2) ? e - 2 : e + 1; }
    function prevHalfedge(e) { return (e % 3 === 0) ? e + 2 : e - 1; }

    function forEachTriangleEdge(points, delaunay, callback) {
        for (let e = 0; e < delaunay.triangles.length; e++) {
            if (e > delaunay.halfedges[e]) {
                const a = points[delaunay.triangles[e]];
                const b = points[delaunay.triangles[nextHalfedge(e)]];
                callback(e, a, b);
            }
        }
    }

    function edgesOfTriangle(t) { return [3 * t, 3 * t + 1, 3 * t + 2]; }
    function pointsOfTriangle(delaunay, t) {
        return edgesOfTriangle(t).map(e => delaunay.triangles[e]);
    }
    function forEachTriangle(points, delaunay, callback) {
        for (let t = 0; t < delaunay.triangles.length / 3; t++) {
            callback(t, pointsOfTriangle(delaunay, t).map(p => points[p]));
        }
    }

    function triangleCenter(points, delaunay, t) {
        const vertices = pointsOfTriangle(delaunay, t).map(p => points[p]);
        return circumcenter(vertices[0], vertices[1], vertices[2]);
    }
    function circumcenter(a, b, c) {
        const ad = a[0] * a[0] + a[1] * a[1];
        const bd = b[0] * b[0] + b[1] * b[1];
        const cd = c[0] * c[0] + c[1] * c[1];
        const D = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));
        return [
            1 / D * (ad * (b[1] - c[1]) + bd * (c[1] - a[1]) + cd * (a[1] - b[1])),
            1 / D * (ad * (c[0] - b[0]) + bd * (a[0] - c[0]) + cd * (b[0] - a[0])),
        ];
    }

    function forEachVoronoiEdge(points, delaunay, callback) {
        for (let e = 0; e < delaunay.triangles.length; e++) {
            if (e < delaunay.halfedges[e]) {
                const p = triangleCenter(points, delaunay, triangleOfEdge(e));
                const q = triangleCenter(points, delaunay, triangleOfEdge(delaunay.halfedges[e]));
                callback(e, p, q);
            }
        }
    }

    function edgesAroundPoint(delaunay, start) {
        const result = [];
        let incoming = start;
        do {
            result.push(incoming);
            const outgoing = nextHalfedge(incoming);
            incoming = delaunay.halfedges[outgoing];
        } while (incoming !== -1 && incoming !== start);
        return result;
    }

    function forEachVoronoiCell(points, delaunay, callback) {
        const seen = new Set();  // of point ids
        for (let e = 0; e < delaunay.triangles.length; e++) {
            const triangle = delaunay.triangles[nextHalfedge(e)];
            if (!seen.has(triangle)) {
                seen.add(triangle);
                const edges = edgesAroundPoint(delaunay, e);
                const triangles = edges.map(triangleOfEdge);
                const vertices = triangles.map(t => triangleCenter(points, delaunay, t));
                const seed = 100;
                const hue = p.map(seed, 0, 100, 90, 180);
                callback(triangle, vertices, hue);

            }
        }
    }



    // Callback functions for drawing
    const drawHalfLines = (e,a,b) => {
        p.line(a[0], a[1], b[0], b[1])
    };
    const drawTriangle = (t, pts) => {
        p.noFill();
        p.beginShape();
        pts.forEach(pt => {
            p.vertex(pt[0], pt[1]);
        });
        p.endShape();
    };
    const drawCircumcenter = (t, pts) => {
        const circCenter = circumcenter(...pts);
        p.fill('black');
        p.circle(circCenter[0], circCenter[1], 4);
    };
    const drawVCells = (pt, verts, hue) => {
        p.noFill();
        p.stroke('black');
        p.beginShape();
        verts.forEach(vert => {
            p.vertex(vert[0], vert[1]);
        });
        p.endShape();
    };

// ---------------------------------------------------------------------------------------------------------------------
    // P5 lifecycle
    p.setup = () => {
        // Initialize canvas
        p.createCanvas(p.windowWidth - 18, p.windowHeight);
        // Initialize seed points
        newPoints();
        // Seed RNG with a random value
        randomizeNoise();

        p.strokeWeight(2);
    }

    p.draw = () => {
        p.background(23, 31, 36);
        // Update seed points every frame
        seedPoints = seedPoints.map((point, i) => {
            // Reference position vectors for anchor point, seed point, and current mouse position
            const anchorVector = p.createVector(anchorPoints[i][0], anchorPoints[i][1]);
            const ptVector = p.createVector(point[0], point[1]);
            const mouseVector = p.createVector(p.mouseX, p.mouseY);

            // Map noise output to be from -pointWanderMaxSpeed to pointWanderMaxSpeed
            // const noiseOutputMappedX = p.map(p.noise(noiseSeedX + (noiseOffset * i)), 0, 1, -pointWanderMaxSpeed, pointWanderMaxSpeed);
            // const noiseOutputMappedY = p.map(p.noise(noiseSeedY + (noiseOffset * i)), 0, 1, -pointWanderMaxSpeed, pointWanderMaxSpeed);
            // Combine into 1 velocity vector
            // let wanderVelocity = p.createVector(noiseOutputMappedX, noiseOutputMappedY);

            // Create vector from seed point location to anchor point location
            const ptToAnchor = anchorVector.sub(ptVector);
            const currentDisplacement = ptToAnchor.mag();
            // Magnitude of 1 (for now)
            let anchorForce = ptToAnchor.normalize();

            // Create vector from mouse position to seed point
            const mouseToPt = ptVector.sub(mouseVector);
            const mouseDisplacement = ptVector.mag();
            // Magnitude of 0.5 (for now)
            let mouseForce = mouseToPt.normalize().div(2);

            // If seed point is within 4 pixels of anchor point on this frame, zero out its velocity
            if(currentDisplacement < 4){
                anchorForce.mult(0);
                // wanderVelocity.mult(0);
            }

            // Delta x and Delta y for this frame
            const dx = anchorForce.x + mouseForce.x;
            const dy = anchorForce.y + mouseForce.y;
            // const dx = anchorForce.x;
            // const dy = anchorForce.y;

            const newX = point[0] + dx;
            const newY = point[1] + dy;

            return [newX, newY];
        });

        // Display black dot for each anchor point
        // anchorPoints.forEach(point => {
        //     p.stroke('black');
        //     p.point(point[0], point[1]);
        // });


        // Set up Delaunator object from seed points
        const delaunay = Delaunator.from(seedPoints);

        // Draw Delaunay triangulation
        //  two different ways:
        //  1) By calculating and drawing half-lines
        //  2) By constructing and drawing entire triangles
        p.stroke('white');
        // forEachTriangleEdge(seedPoints, delaunay, drawHalfLines);
        // forEachTriangle(seedPoints, delaunay, drawTriangle);

        // Draw Voronoi partitioning with seed points as "geographic" center points
        //
        //
        //
        p.stroke(lineColor);
        // forEachTriangle(seedPoints, delaunay, drawCircumcenter);
        forEachVoronoiEdge(seedPoints, delaunay, drawHalfLines);
        // forEachVoronoiCell(seedPoints, delaunay, drawVCells);


        // Draw lines from seed point to mouse
        seedPoints.forEach(point => {
            const ptVector = p.createVector(point[0], point[1]);
            const mouseVector = p.createVector(p.mouseX, p.mouseY);
            const dist = ptVector.dist(mouseVector);
            const hue = p.map(dist, 0, 180, 0, 180);
            p.stroke(hue);
            if(dist < 180){
                // p.line(ptVector.x, ptVector.y, mouseVector.x, mouseVector.y);
            }

        });

        // On-screen debug text
        p.fill('black');
        p.textSize(24);
        // p.text('NoiseX input: ' + noiseSeedX.toString(), 10, 30);
        // p.text('NoiseX value: ' + p.noise(noiseSeedX), 10, 50);
        //
        // p.text('NoiseY input: ' + noiseSeedY.toString(), 10, 70);
        // p.text('NoiseY value: ' + p.noise(noiseSeedY), 10, 90);

        // Increment noise input value
        incrementNoise();

    }

    // Mouse is full clicked
    p.mouseClicked = () => {
        // newPoints();
        // randomizeNoise();
    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

}
