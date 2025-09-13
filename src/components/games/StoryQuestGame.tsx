import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Star, Trophy, Heart, Sparkles } from "lucide-react";

interface StoryQuestGameProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

interface StoryNode {
  id: string;
  text: string;
  image: string;
  choices: {
    text: string;
    nextNode: string;
    points: number;
    skill: 'reading' | 'comprehension' | 'vocabulary' | 'creativity';
  }[];
  isEnding?: boolean;
  endingType?: 'good' | 'great' | 'perfect';
}

export const StoryQuestGame = ({ onComplete, onExit }: StoryQuestGameProps) => {
  const [currentNode, setCurrentNode] = useState<string>('start');
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [visitedNodes, setVisitedNodes] = useState<string[]>(['start']);
  const [gameOver, setGameOver] = useState(false);
  const [skills, setSkills] = useState({
    reading: 0,
    comprehension: 0,
    vocabulary: 0,
    creativity: 0
  });

  const story: Record<string, StoryNode> = {
    start: {
      id: 'start',
      text: "Welcome to the Magical Forest! You are a young explorer who has discovered a mysterious, glowing path. As you stand at the edge of the forest, you notice three different trails ahead of you.",
      image: "🌲",
      choices: [
        {
          text: "Take the bright, sunny path with colorful flowers",
          nextNode: 'sunny_path',
          points: 10,
          skill: 'reading'
        },
        {
          text: "Follow the misty, mysterious trail with glowing mushrooms",
          nextNode: 'misty_path',
          points: 15,
          skill: 'creativity'
        },
        {
          text: "Choose the peaceful stream path with singing birds",
          nextNode: 'stream_path',
          points: 12,
          skill: 'comprehension'
        }
      ]
    },
    sunny_path: {
      id: 'sunny_path',
      text: "You walk down the sunny path and discover a friendly rabbit wearing a tiny hat. The rabbit speaks: 'Hello there! I'm looking for my lost golden carrot. It's very special to me. Will you help me find it?'",
      image: "🐰",
      choices: [
        {
          text: "Of course! I'd love to help you find your golden carrot.",
          nextNode: 'help_rabbit',
          points: 20,
          skill: 'comprehension'
        },
        {
          text: "What makes this carrot so special?",
          nextNode: 'ask_about_carrot',
          points: 15,
          skill: 'vocabulary'
        },
        {
          text: "I'm sorry, but I'm on my own adventure.",
          nextNode: 'refuse_help',
          points: 5,
          skill: 'reading'
        }
      ]
    },
    misty_path: {
      id: 'misty_path',
      text: "The misty path leads you to an enchanted clearing where a wise owl sits on a glowing crystal tree. The owl hoots softly: 'Young adventurer, I can see you have a brave heart. I guard three magical gifts, but you may choose only one.'",
      image: "🦉",
      choices: [
        {
          text: "Choose the Crystal of Wisdom that glows with blue light",
          nextNode: 'crystal_wisdom',
          points: 25,
          skill: 'vocabulary'
        },
        {
          text: "Pick the Feather of Courage that shimmers like gold",
          nextNode: 'feather_courage',
          points: 20,
          skill: 'creativity'
        },
        {
          text: "Select the Seed of Kindness that pulses with warm light",
          nextNode: 'seed_kindness',
          points: 30,
          skill: 'comprehension'
        }
      ]
    },
    stream_path: {
      id: 'stream_path',
      text: "Following the stream, you meet a family of singing frogs preparing for their annual concert. The lead frog croaks melodiously: 'We need help creating the perfect song for our performance tonight. Each note must tell a story!'",
      image: "🐸",
      choices: [
        {
          text: "Suggest a song about friendship and working together",
          nextNode: 'friendship_song',
          points: 25,
          skill: 'creativity'
        },
        {
          text: "Propose a song about the beauty of nature",
          nextNode: 'nature_song',
          points: 20,
          skill: 'vocabulary'
        },
        {
          text: "Recommend a song about overcoming challenges",
          nextNode: 'challenge_song',
          points: 22,
          skill: 'comprehension'
        }
      ]
    },
    help_rabbit: {
      id: 'help_rabbit',
      text: "The rabbit jumps with joy! Together, you search behind flower beds and under logs. Finally, you spot something glinting near a fairy ring of mushrooms. It's the golden carrot! The rabbit is so grateful that it gives you a magical friendship bracelet.",
      image: "🥕",
      choices: [
        {
          text: "Continue deeper into the magical forest",
          nextNode: 'deeper_forest',
          points: 15,
          skill: 'reading'
        }
      ]
    },
    crystal_wisdom: {
      id: 'crystal_wisdom',
      text: "You choose the Crystal of Wisdom. It begins to glow brighter in your hands, and suddenly you can understand the language of all forest creatures! A group of baby squirrels approach you, chattering excitedly about a hidden treasure.",
      image: "💎",
      choices: [
        {
          text: "Follow the squirrels to find the hidden treasure",
          nextNode: 'treasure_hunt',
          points: 20,
          skill: 'vocabulary'
        }
      ]
    },
    deeper_forest: {
      id: 'deeper_forest',
      text: "As you venture deeper, you discover a magical library tree with books growing from its branches like fruit. An elderly wizard tends to the tree, carefully watering the book-fruits. He smiles at you warmly.",
      image: "📚",
      choices: [
        {
          text: "Ask the wizard about the magical books",
          nextNode: 'magic_books',
          points: 25,
          skill: 'reading'
        },
        {
          text: "Offer to help water the book-fruits",
          nextNode: 'help_wizard',
          points: 30,
          skill: 'comprehension'
        }
      ]
    },
    magic_books: {
      id: 'magic_books',
      text: "The wizard explains that each book contains a different adventure, and reading them makes the stories come to life! He offers you a special book that will teach you about courage, friendship, and wisdom. You've completed an amazing adventure!",
      image: "✨",
      choices: [],
      isEnding: true,
      endingType: 'great'
    },
    help_wizard: {
      id: 'help_wizard',
      text: "Your kindness touches the wizard's heart. As you help water the books, they begin to glow and grow bigger! The wizard declares you a true Friend of the Forest and grants you the power to return anytime you wish. You've achieved the perfect ending!",
      image: "🌟",
      choices: [],
      isEnding: true,
      endingType: 'perfect'
    },
    treasure_hunt: {
      id: 'treasure_hunt',
      text: "The squirrels lead you to a beautiful grove where a chest filled with magical acorns awaits. These acorns can grow into any tree you imagine! You plant one and watch as a magnificent rainbow tree springs up, creating a bridge to new adventures!",
      image: "🌈",
      choices: [],
      isEnding: true,
      endingType: 'great'
    },
    friendship_song: {
      id: 'friendship_song',
      text: "Your song about friendship brings tears of joy to the frogs' eyes. They perform it beautifully, and all the forest animals gather to listen. You've created something truly special that brings everyone together!",
      image: "🎵",
      choices: [],
      isEnding: true,
      endingType: 'perfect'
    },
    nature_song: {
      id: 'nature_song',
      text: "The nature song you suggest becomes a beautiful melody that makes all the flowers bloom brighter and the stream sparkle more brilliantly. You've helped create magic in the forest!",
      image: "🌺",
      choices: [],
      isEnding: true,
      endingType: 'great'
    },
    challenge_song: {
      id: 'challenge_song',
      text: "Your song about overcoming challenges inspires all the forest creatures. Even the shyest animals come out to listen and feel brave. You've made a real difference!",
      image: "🎭",
      choices: [],
      isEnding: true,
      endingType: 'good'
    }
  };

  const currentStoryNode = story[currentNode];

  const handleChoice = (choice: StoryNode['choices'][0]) => {
    const newScore = score + choice.points;
    setScore(newScore);
    
    setSkills(prev => ({
      ...prev,
      [choice.skill]: prev[choice.skill] + choice.points
    }));

    if (choice.nextNode && story[choice.nextNode]) {
      setCurrentNode(choice.nextNode);
      setVisitedNodes(prev => [...prev, choice.nextNode]);
      
      if (story[choice.nextNode].isEnding) {
        setGameOver(true);
      }
    }
  };

  const resetGame = () => {
    setCurrentNode('start');
    setScore(0);
    setHearts(3);
    setVisitedNodes(['start']);
    setGameOver(false);
    setSkills({ reading: 0, comprehension: 0, vocabulary: 0, creativity: 0 });
  };

  const getEndingMessage = () => {
    if (!currentStoryNode.isEnding) return "";
    
    switch (currentStoryNode.endingType) {
      case 'perfect':
        return "Perfect Adventure! You showed exceptional kindness and wisdom!";
      case 'great':
        return "Great Adventure! You made wonderful choices throughout your journey!";
      case 'good':
        return "Good Adventure! You completed your quest successfully!";
      default:
        return "Adventure Complete!";
    }
  };

  const getEndingStars = () => {
    if (!currentStoryNode.isEnding) return 0;
    
    switch (currentStoryNode.endingType) {
      case 'perfect': return 3;
      case 'great': return 2;
      case 'good': return 1;
      default: return 1;
    }
  };

  if (gameOver) {
    const stars = getEndingStars();
    const finalScore = Math.min(100, score + stars * 20);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="text-6xl mb-4">📚</div>
            <CardTitle className="text-2xl font-fredoka text-foreground">
              {getEndingMessage()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(3)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-8 h-8 ${
                    i < stars ? 'text-accent fill-accent' : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="text-lg font-fredoka">Score: {finalScore}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Nodes explored: {visitedNodes.length}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>Reading: {skills.reading}</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                <span>Creativity: {skills.creativity}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>Comprehension: {skills.comprehension}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>Vocabulary: {skills.vocabulary}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={resetGame} variant="kid" className="flex-1">
                New Adventure
              </Button>
              <Button onClick={() => onComplete(finalScore)} variant="outline" className="flex-1">
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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={onExit}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-fredoka text-foreground">Story Quest</h1>
          <div className="flex items-center gap-1 justify-center">
            {[...Array(hearts)].map((_, i) => (
              <Heart key={i} className="w-4 h-4 text-red-500 fill-red-500" />
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Score: {score}</p>
          <p className="text-xs text-muted-foreground">Nodes: {visitedNodes.length}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="text-8xl mb-4">{currentStoryNode.image}</div>
            </div>
            
            <div className="prose prose-lg max-w-none text-center mb-6">
              <p className="text-foreground leading-relaxed">
                {currentStoryNode.text}
              </p>
            </div>

            {currentStoryNode.choices.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-fredoka text-foreground text-center mb-4">
                  What do you choose?
                </h3>
                {currentStoryNode.choices.map((choice, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full p-4 h-auto text-left justify-start"
                    onClick={() => handleChoice(choice)}
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">
                        +{choice.points}
                      </Badge>
                      <span className="flex-1">{choice.text}</span>
                      <Badge variant="outline" className="text-xs">
                        {choice.skill}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center font-fredoka">Your Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(skills).map(([skill, value]) => (
                <div key={skill} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium capitalize">{skill}</span>
                    <span className="text-sm text-muted-foreground">{value}</span>
                  </div>
                  <Progress value={Math.min(100, (value / 50) * 100)} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};