import React, { useEffect, useState } from "react";
import { Layer, Stage, Line, Arrow, Text } from "react-konva";

var ROTATED_POINTS = {};

export function EquilateralTriangle({ SideLength, CanvasSize, Rotate }) {
    const sideLength = SideLength;
    const centerX = CanvasSize / 2;
    const centerY = CanvasSize / 2;
    const rotatingAngle = Rotate || 1;

    // Calculate the three points of the equilateral triangle
    const height = (Math.sqrt(3) / 2) * sideLength;
    const originalPoints = [
        { x: centerX, y: centerY - height / 2 }, // Top vertex
        { x: centerX - sideLength / 2, y: centerY + height / 2 }, // Bottom left
        { x: centerX + sideLength / 2, y: centerY + height / 2 }, // Bottom right
    ];

    const rotatePoint = (point, angle, center) => {
        const rad = (Math.PI / 180) * angle; // Convert to radians
        const cosA = Math.cos(rad);
        const sinA = Math.sin(rad);

        return {
            x:
                center.x +
                (point.x - center.x) * cosA -
                (point.y - center.y) * sinA,
            y:
                center.y +
                (point.x - center.x) * sinA +
                (point.y - center.y) * cosA,
        };
    };

    const rotatedPoints = originalPoints.map((point) =>
        rotatePoint(point, rotatingAngle, { x: centerX, y: centerY })
    );

    ROTATED_POINTS = rotatedPoints;

    return (
        <>
            {/* First Line (Red) */}
            <Line
                points={[
                    rotatedPoints[2].x,
                    rotatedPoints[2].y,
                    rotatedPoints[0].x,
                    rotatedPoints[0].y,
                ]}
                stroke="red"
                strokeWidth={4}
                lineJoin="round"
            />
            {/* Second Line (Blue) */}

            <Line
                points={[
                    rotatedPoints[1].x,
                    rotatedPoints[1].y,
                    rotatedPoints[2].x,
                    rotatedPoints[2].y,
                ]}
                stroke="yellow"
                strokeWidth={4}
                lineJoin="round"
            />
            {/* Third Line (Green) */}
            <Line
                points={[
                    rotatedPoints[0].x,
                    rotatedPoints[0].y,
                    rotatedPoints[1].x,
                    rotatedPoints[1].y,
                ]}
                stroke="blue"
                strokeWidth={4}
                lineJoin="round"
            />
        </>
        // </Stage>
    );
}

export function Star({ SideLength, CanvasSize, Rotate, Shifting }) {
    const findIntersection = (A, B, C) => {
        return {
            x: (A.x + B.x + C.x) / 3,
            y: (A.y + B.y + C.y) / 3,
        };
    };

    function rotatePointAroundFixed(pivot, point, angle) {
        let rad = (Math.PI / 180) * angle; // Convert degrees to radians

        let xRel = point.x - pivot.x;
        let yRel = point.y - pivot.y;

        let xRot = xRel * Math.cos(rad) - yRel * Math.sin(rad);
        let yRot = xRel * Math.sin(rad) + yRel * Math.cos(rad);

        return { x: xRot + pivot.x, y: yRot + pivot.y };
    }

    const sideLength = SideLength;
    const centerX = CanvasSize / 2;
    const centerY = CanvasSize / 2;
    const shiftingX = Shifting;
    const rotatingAngle = Rotate;

    var MidPoint = findIntersection(
        ROTATED_POINTS[0],
        ROTATED_POINTS[1],
        ROTATED_POINTS[2]
    );

    MidPoint = {
        ...MidPoint,
        x: parseFloat(MidPoint.x) + parseFloat(shiftingX),
    };

    const RotatingCoordinates = ROTATED_POINTS.map((B) => {
        var cord = rotatePointAroundFixed(MidPoint, B, rotatingAngle);
        cord = { ...cord, x: parseFloat(cord.x) + parseFloat(shiftingX) };
        return cord;
    });

    console.log(RotatingCoordinates);

    return (
        <>
            <Line
                points={[
                    MidPoint.x,
                    MidPoint.y,
                    RotatingCoordinates[0].x,
                    RotatingCoordinates[0].y,
                ]}
                stroke="red"
                fill="red"
                strokeWidth={2}
            />

            <Line
                points={[
                    MidPoint.x,
                    MidPoint.y,
                    RotatingCoordinates[1].x,
                    RotatingCoordinates[1].y,
                ]}
                stroke="blue"
                fill="blue"
                strokeWidth={2}
            />

            <Text
                x={MidPoint.x}
                y={MidPoint.y}
                text={`${(MidPoint.x).toFixed(4)}, ${(MidPoint.y).toFixed(4)}`}
                fontSize={12}
                fontFamily="Arial"
                fill="black"
                draggable 
            />

            <Line
                points={[
                    MidPoint.x,
                    MidPoint.y,
                    RotatingCoordinates[2].x,
                    RotatingCoordinates[2].y,
                ]}
                stroke="gold"
                fill="gold"
                strokeWidth={2}
            />
        </>
    );
}

export default function VectorDiagram() {
    const gridSize = 20;
    const canvasSize = 400;

    const [angle, setAngle] = useState(0);
    const [shifting, setShifting] = useState(0);

    const generateGrid = () => {
        const lines = [];

        // Vertical lines
        for (let i = 0; i <= canvasSize; i += gridSize) {
            lines.push(
                <Line
                    key={`v-${i}`}
                    points={[i, 0, i, canvasSize]}
                    stroke="lightgray"
                    strokeWidth={1}
                />
            );
        }

        // Horizontal lines
        for (let i = 0; i <= canvasSize; i += gridSize) {
            lines.push(
                <Line
                    key={`h-${i}`}
                    points={[0, i, canvasSize, i]}
                    stroke="lightgray"
                    strokeWidth={1}
                />
            );
        }

        return lines;
    };

    return (
        <div>
            Rotating:
            <input
                type="number"
                onChange={(e) => {
                    setAngle(e.target.value);
                }}
                value={angle}
            />
            <br />
            shifting:
            <input
                type="number"
                onChange={(e) => {
                    setShifting(e.target.value);
                }}
                value={shifting}
            />
            <Stage width={canvasSize} height={canvasSize}>
                <Layer>{generateGrid()}</Layer>
                <Layer>
                    <EquilateralTriangle
                        SideLength={250}
                        CanvasSize={canvasSize}
                        Rotate={0}
                    />
                    <Star
                        SideLength={250}
                        CanvasSize={canvasSize}
                        Rotate={angle}
                        Shifting={shifting}
                    />
                </Layer>
            </Stage>
        </div>
    );
}
