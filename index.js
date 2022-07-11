const startBtn = document.getElementById('start-btn');
const convexHull = [];
let generatedPoints = [];
let refresh = true;
let isCanvasOn = false;
let ripple = false;

function onStart (e) {
    e.preventDefault();
    const points = document.querySelector('.points-input').value;
    if (parseInt(points) < 3 || parseInt(points) > 1000) {
        alert('Incorrect input (points). Should be in [3-1000] range');
        return;
    }
    $('.start-popup').css('display', 'none');
    $('#canvasContainer').css('display', 'block');
    generatedPoints = [ ...generatePoints(parseInt(points) || 10) ];
    isCanvasOn = true;

    setup();
    main();
    return false;
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function setup () { // setup canvas
    const myCanvas = createCanvas(window.innerWidth, window.innerHeight);
    myCanvas.parent('canvasContainer');
}

function generatePoints (n) {
    const arrayOfPoints = [];
    for (let i = 0; i < n; i++) {
        let x = getRandomNumber(100, window.innerWidth - 100);
        let y = getRandomNumber(100, window.innerHeight - 100);
        let point = new Point(x, y);
        arrayOfPoints.push(point)
    }
    return arrayOfPoints;
}

async function draw () {
    if (isCanvasOn && refresh) {
        clear();
        drawPoints();
        drawLinesBwPoints(convexHull);
        return;
    }
}



const main = () => {
    drawPoints();
    const points = [ ...generatedPoints ];
    getConvexHull(points, points.length);
}


const drawPoints = () => {
    for (let i = 0; i < generatedPoints.length; i++) {
        fill('rgb(255, 157, 9)');
        strokeWeight(2);
        stroke('rgb(77, 46, 0)')
        ellipse(generatedPoints[ i ].x, generatedPoints[ i ].y, 10, 10);
    }
}


const sleep = (time) => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve();
    }, time)
});


// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation (p, q, r) {
    let val = (q.y - p.y) * (r.x - q.x) -
        (q.x - p.x) * (r.y - q.y);

    if (val == 0) return 0;  // collinear
    return (val > 0) ? 1 : 2; // clock or counterclock wise
}

async function getConvexHull (points, n) {
    await sleep(50);
    // There must be at least 3 points
    if (n < 3) {
        alert('there must be at least 3 points')
        return;
    }

    // Find the leftmost point
    let l = 0;
    for (let i = 1; i < n; i++)
        if (points[ i ].x < points[ l ].x)
            l = i;

    // Start from leftmost point, keep moving
    // counterclockwise until reach the start point
    // again. This loop runs O(h) times where h is
    // number of points in result or output.
    let p = l, q;
    do {

        // Add current point to result // which is the leftmost point
        convexHull.push(points[ p ]);
        await sleep(200);
        refresh = false;
        await sleep(50);

        // Search for a point 'q' such that
        // orientation(p, q, x) is counterclockwise
        // for all points 'x'. The idea is to keep
        // track of last visited most counterclock-
        // wise point in q. If any point 'i' is more
        // counterclock-wise than q, then update q.
        q = (p + 1) % n;

        for (let i = 0; i < n; i++) {
            // If i is more counterclockwise than
            // current q, then update q
            line(points[ p ].x, points[ p ].y, points[ i ].x, points[ i ].y);
            await sleep(10);
            if (orientation(points[ p ], points[ i ], points[ q ]) === 2)
                q = i;
        }

        // Now q is the most counterclockwise with
        // respect to p. Set p as q for next iteration,
        // so that q is added to result 'convexHull'
        p = q;
        refresh = true;
    } while (p != l);  // While we don't come to first
    // point
    await sleep(50);
    refresh = false;
    line(convexHull[ 0 ].x, convexHull[ 0 ].y, convexHull[ convexHull.length - 1 ].x, convexHull[ convexHull.length - 1 ].y);
}


const drawLinesBwPoints = (convexHull) => {
    for (let i = 0; i < convexHull.length - 1; i++) {
        line(convexHull[ i ].x, convexHull[ i ].y, convexHull[ i + 1 ].x, convexHull[ i + 1 ].y);
    }
}

function getRandomNumber (min, max) {
    return Math.random() * (max - min) + min;
}
