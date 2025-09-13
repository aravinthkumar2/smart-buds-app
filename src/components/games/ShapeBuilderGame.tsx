import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCw, Trash2, Check, Star, Trophy } from "lucide-react";

interface ShapeBuilderGameProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

interface Shape {
  id: string;
  type: 'circle' | 'square' | 'triangle' | 'rectangle';
  color: string;
  x: number;
  y: number;
  rotation: number;
  size: number;
}

interface Target {
  shapes: Omit<Shape, 'id' | 'x' | 'y'>[];
  name: string;
  difficulty: number;
}

export const ShapeBuilderGame = ({ onComplete, onExit }: ShapeBuilderGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameOver, setGameOver] = useState(false);
  const [placedShapes, setPlacedShapes] = useState<Shape[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [draggedShape, setDraggedShape] = useState<Shape | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const targets: Target[] = [
    {
      name: "House",
      difficulty: 1,
      shapes: [
        { type: 'rectangle', color: '#8B4513', rotation: 0, size: 80 }, // Brown house base
        { type: 'triangle', color: '#DC143C', rotation: 0, size: 60 }, // Red roof
        { type: 'square', color: '#4169E1', rotation: 0, size: 20 }, // Blue door
        { type: 'circle', color: '#FFD700', rotation: 0, size: 15 }, // Yellow window
      ]
    },
    {
      name: "Snowman",
      difficulty: 2,
      shapes: [
        { type: 'circle', color: '#FFFFFF', rotation: 0, size: 60 }, // Large base
        { type: 'circle', color: '#FFFFFF', rotation: 0, size: 45 }, // Medium middle
        { type: 'circle', color: '#FFFFFF', rotation: 0, size: 30 }, // Small head
        { type: 'triangle', color: '#FFA500', rotation: 0, size: 10 }, // Orange nose
      ]
    },
    {
      name: "Car",
      difficulty: 3,
      shapes: [
        { type: 'rectangle', color: '#FF4500', rotation: 0, size: 80 }, // Car body
        { type: 'rectangle', color: '#87CEEB', rotation: 0, size: 40 }, // Windshield
        { type: 'circle', color: '#2F4F4F', rotation: 0, size: 25 }, // Front wheel
        { type: 'circle', color: '#2F4F4F', rotation: 0, size: 25 }, // Back wheel
      ]
    }
  ];

  const [currentTarget, setCurrentTarget] = useState<Target>(targets[0]);
  const [availableShapes, setAvailableShapes] = useState<Omit<Shape, 'id' | 'x' | 'y'>[]>([]);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  useEffect(() => {
    // Initialize available shapes based on current target plus some extras
    const targetShapes = [...currentTarget.shapes];
    const extraShapes = [
      { type: 'circle' as const, color: '#FF69B4', rotation: 0, size: 30 },
      { type: 'square' as const, color: '#32CD32', rotation: 0, size: 35 },
      { type: 'triangle' as const, color: '#9370DB', rotation: 0, size: 40 },
    ];
    setAvailableShapes([...targetShapes, ...extraShapes]);
  }, [currentTarget]);

  useEffect(() => {
    drawCanvas();
  }, [placedShapes, draggedShape]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw placed shapes
    [...placedShapes, ...(draggedShape ? [draggedShape] : [])].forEach(shape => {
      drawShape(ctx, shape);
    });
  };

  const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
    ctx.save();
    ctx.translate(shape.x, shape.y);
    ctx.rotate((shape.rotation * Math.PI) / 180);
    ctx.fillStyle = shape.color;
    ctx.strokeStyle = selectedShape === shape.id ? '#000' : shape.color;
    ctx.lineWidth = selectedShape === shape.id ? 3 : 1;

    switch (shape.type) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, shape.size / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        break;
      case 'square':
        ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
        ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
        break;
      case 'rectangle':
        ctx.fillRect(-shape.size / 2, -shape.size / 4, shape.size, shape.size / 2);
        ctx.strokeRect(-shape.size / 2, -shape.size / 4, shape.size, shape.size / 2);
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -shape.size / 2);
        ctx.lineTo(-shape.size / 2, shape.size / 2);
        ctx.lineTo(shape.size / 2, shape.size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
    }
    ctx.restore();
  };

  const addShape = (shapeType: Omit<Shape, 'id' | 'x' | 'y'>) => {
    const newShape: Shape = {
      ...shapeType,
      id: Date.now().toString(),
      x: 200,
      y: 150,
    };
    setPlacedShapes([...placedShapes, newShape]);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a shape
    const clickedShape = placedShapes.find(shape => {
      const dx = x - shape.x;
      const dy = y - shape.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= shape.size / 2;
    });

    if (clickedShape) {
      setSelectedShape(clickedShape.id);
      setDraggedShape(clickedShape);
      setIsDragging(true);
    } else {
      setSelectedShape(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !draggedShape) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDraggedShape({ ...draggedShape, x, y });
  };

  const handleCanvasMouseUp = () => {
    if (isDragging && draggedShape) {
      setPlacedShapes(shapes => 
        shapes.map(shape => 
          shape.id === draggedShape.id ? draggedShape : shape
        )
      );
    }
    setIsDragging(false);
    setDraggedShape(null);
  };

  const rotateSelectedShape = () => {
    if (!selectedShape) return;
    setPlacedShapes(shapes =>
      shapes.map(shape =>
        shape.id === selectedShape
          ? { ...shape, rotation: (shape.rotation + 45) % 360 }
          : shape
      )
    );
  };

  const deleteSelectedShape = () => {
    if (!selectedShape) return;
    setPlacedShapes(shapes => shapes.filter(shape => shape.id !== selectedShape));
    setSelectedShape(null);
  };

  const checkSolution = () => {
    // Simple scoring based on shape count and positioning
    const targetShapeCount = currentTarget.shapes.length;
    const placedShapeCount = placedShapes.length;
    
    let accuracy = 0;
    if (placedShapeCount >= targetShapeCount) {
      accuracy = Math.max(0, 100 - Math.abs(placedShapeCount - targetShapeCount) * 10);
    } else {
      accuracy = (placedShapeCount / targetShapeCount) * 60;
    }

    const levelBonus = level * 10;
    const timeBonus = Math.floor(timeLeft / 10);
    const finalScore = Math.min(100, accuracy + levelBonus + timeBonus);

    setScore(score + finalScore);

    if (level < targets.length) {
      setLevel(level + 1);
      setCurrentTarget(targets[level]);
      setPlacedShapes([]);
      setTimeLeft(120);
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(120);
    setGameOver(false);
    setPlacedShapes([]);
    setSelectedShape(null);
    setCurrentTarget(targets[0]);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="text-6xl mb-4">🏗️</div>
            <CardTitle className="text-2xl font-fredoka text-foreground">
              Great Building!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-accent" />
                <span className="text-lg font-fredoka">Score: {score}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="text-lg font-fredoka">Level: {level}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={resetGame} variant="kid" className="flex-1">
                Play Again
              </Button>
              <Button onClick={() => onComplete(score)} variant="outline" className="flex-1">
                Continue
              </Button>
            </div>
            
            <Button onClick={onExit} variant="ghost" className="w-full">
              Back to Games
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={onExit}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-fredoka text-foreground">Shape Builder</h1>
          <p className="text-sm text-muted-foreground">Build: {currentTarget.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Score: {score}</p>
          <p className="text-sm text-muted-foreground">Time: {timeLeft}s</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-4 gap-4">
        {/* Shape Palette */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-fredoka">Shapes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {availableShapes.map((shape, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full h-12 flex items-center gap-2"
                onClick={() => addShape(shape)}
              >
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: shape.color }}
                />
                <span className="capitalize">{shape.type}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Canvas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-fredoka">Canvas</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rotateSelectedShape}
                  disabled={!selectedShape}
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deleteSelectedShape}
                  disabled={!selectedShape}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="border border-border rounded-lg cursor-pointer w-full"
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
            />
            <Button onClick={checkSolution} variant="kid" className="w-full mt-4">
              <Check className="w-4 h-4 mr-2" />
              Check Solution
            </Button>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-fredoka">Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Level {level}</span>
                <span>{level}/{targets.length}</span>
              </div>
              <Progress value={(level / targets.length) * 100} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Time</span>
                <span>{timeLeft}s</span>
              </div>
              <Progress value={(timeLeft / 120) * 100} />
            </div>

            <Badge variant="outline" className="w-full justify-center">
              Difficulty: {currentTarget.difficulty}/3
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};