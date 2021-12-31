var ripple = false;
const button = document.getElementById('start-btn');

var gPoints = [];
let isCanvasOn = false;
let hull = [];
let refresh = true;

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


button.addEventListener('mouseover', function(e) {
    if(!ripple) {
        let x = e.clientX - e.target.offsetLeft;
        let y = e.clientY - e.target.offSetTop;
    
        ripple = document.createElement('span');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
    
        this.appendChild(ripple);
    }
})

button.addEventListener('mouseleave', function(e) {
    if(ripple) {
        ripple = null;
    }
})

button.addEventListener('click', function(e) {
    const points = document.querySelector('.points-input').value;
    $('.start-popup').css('display', 'none');
    $('#myContainer').css('display', 'block');
    gPoints = generatePoints(points || 10);
    isCanvasOn = true;

    setup();
    main();
})

function setup() {
        const myCanvas = createCanvas(window.innerWidth,   window.innerHeight);
        myCanvas.parent('myContainer');
}

function generatePoints(n) {
    const arrayOfPoints = [];
    for(let i = 0; i<n; i++) {
        let x = getRandomArbitrary(300, window.innerWidth-300);
        let y = getRandomArbitrary(300, window.innerHeight-300);
        let point = new Point(x,y);
        arrayOfPoints.push(point)
    }
    return arrayOfPoints;
}

async function draw() {
    if(isCanvasOn && refresh) {
        clear();
        background('rgba(0,0,0,0)');
        drawPoints();
        drawHullLines(hull);
        return;
    }
}



const main = () => {
    drawPoints();
    getHull();
}



function getHull() {
    const points = [...gPoints];
    convexHull(points, points.length);
}

const drawPoints = () => {
    for(let i = 0; i<gPoints.length; i++) {
        fill('rgb(255, 157, 9)');
        strokeWeight(2);
        stroke('rgb(77, 46, 0)')
        ellipse(gPoints[i].x, gPoints[i].y, 10, 10);
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
function orientation(p, q, r)
{
    let val = (q.y - p.y) * (r.x - q.x) -
                    (q.x - p.x) * (r.y - q.y);
        
        if (val == 0) return 0;  // collinear
        return (val > 0)? 1: 2; // clock or counterclock wise
}

async function convexHull(points, n)
{
        await sleep(50);
        // There must be at least 3 points
        if (n < 3) return;

        // Find the leftmost point
        let l = 0;
        for (let i = 1; i < n; i++)
            if (points[i].x < points[l].x)
                l = i;
        
        // Start from leftmost point, keep moving
        // counterclockwise until reach the start point
        // again. This loop runs O(h) times where h is
        // number of points in result or output.
        let p = l, q;
        do
        {   
    
            // Add current point to result
            hull.push(points[p]);
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
               
            for (let i = 0; i < n; i++)
            {
               // If i is more counterclockwise than
               // current q, then update q
               line(points[p].x, points[p].y, points[i].x, points[i].y);
               await sleep(10);
               if (orientation(points[p], points[i], points[q]) === 2)
                   q = i;
            }
        
            // Now q is the most counterclockwise with
            // respect to p. Set p as q for next iteration,
            // so that q is added to result 'hull'
            p = q;
            refresh = true;
        } while (p != l);  // While we don't come to first
                           // point
        await sleep(50);
        refresh = false;
        line(hull[0].x, hull[0].y, hull[hull.length-1].x, hull[hull.length-1].y);
}
 

const drawHullLines = (hull) => {
    for(let i = 0; i < hull.length-1; i++) {
        line(hull[i].x, hull[i].y, hull[i+1].x, hull[i+1].y);
    }
}  



function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

