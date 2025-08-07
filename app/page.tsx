'use client'

import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Float, Text3D, Center, Stars, Sphere } from '@react-three/drei'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Mic, Send, Settings, Calendar, Bell, Brain, Zap, Heart, Coffee, Moon, Sun, Sparkles, Volume2, MessageSquare, Loader2, Music, Sun as SunIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Initialize Gemini AI with the provided API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyBslXVN25cNNYWGlosQkZrYeiLU1xB9MHQ");

type Mood = {
  id: string
  name: string
  color: string
  glowColor: string
  bgColor: string
  icon: React.ReactNode
  description: string
}

const moods: Mood[] = [
  {
    id: 'focused',
    name: 'Focused',
    color: '#E5E7EB',
    glowColor: 'rgba(229, 231, 235, 0.6)',
    bgColor: 'from-gray-200/20 to-gray-300/10',
    icon: <Brain className="w-4 h-4" />,
    description: 'Sharp and analytical precision'
  },
  {
    id: 'energetic',
    name: 'Energetic',
    color: '#F3F4F6',
    glowColor: 'rgba(243, 244, 246, 0.7)',
    bgColor: 'from-gray-100/20 to-gray-200/10',
    icon: <Zap className="w-4 h-4" />,
    description: 'Dynamic silver lightning'
  },
  {
    id: 'calm',
    name: 'Calm',
    color: '#D1D5DB',
    glowColor: 'rgba(209, 213, 219, 0.5)',
    bgColor: 'from-gray-300/20 to-gray-400/10',
    icon: <Heart className="w-4 h-4" />,
    description: 'Peaceful silver serenity'
  },
  {
    id: 'creative',
    name: 'Creative',
    color: '#F9FAFB',
    glowColor: 'rgba(249, 250, 251, 0.8)',
    bgColor: 'from-gray-50/20 to-gray-100/10',
    icon: <Sparkles className="w-4 h-4" />,
    description: 'Brilliant silver inspiration'
  },
  {
    id: 'casual',
    name: 'Casual',
    color: '#E5E7EB',
    glowColor: 'rgba(229, 231, 235, 0.6)',
    bgColor: 'from-gray-200/20 to-gray-300/10',
    icon: <Coffee className="w-4 h-4" />,
    description: 'Relaxed silver comfort'
  }
]

function SpaceBackground({ mood }: { mood: Mood }) {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
      {/* Ambient space lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.3} color={mood.color} />
      <pointLight position={[-10, -10, -10]} intensity={0.2} color="#ffffff" />
      
      {/* Animated stars */}
      <Stars 
        radius={300} 
        depth={60} 
        count={8000} 
        factor={7} 
        saturation={0} 
        fade 
        speed={0.5}
      />
      
      {/* Floating silver orbs */}
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh position={[-4, 3, -8]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial 
            color={mood.color} 
            emissive={mood.color} 
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>
      
      <Float speed={0.8} rotationIntensity={0.5} floatIntensity={0.6}>
        <mesh position={[4, -2, -6]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            color="#F3F4F6" 
            emissive="#F3F4F6" 
            emissiveIntensity={0.2}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.7}
          />
        </mesh>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.8}>
        <mesh position={[0, 2, -10]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial 
            color="#E5E7EB" 
            emissive="#E5E7EB" 
            emissiveIntensity={0.4}
            metalness={1.0}
            roughness={0.0}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Float>
      
      {/* Central NAVI hologram */}
      <Center>
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
          <Text3D
            font="/fonts/Geist_Bold.json"
            size={0.4}
            height={0.05}
            position={[0, 0, -12]}
          >
            NAVI
            <meshStandardMaterial 
              color={mood.color} 
              emissive={mood.color} 
              emissiveIntensity={0.5}
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.9}
            />
          </Text3D>
        </Float>
      </Center>
      
      <Environment preset="night" />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  )
}

function LoadingAnimation() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center z-50">
      <div className="relative">
        {/* 3D Loading Scene */}
        <div className="w-96 h-96 mb-8">
          <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
            <ambientLight intensity={0.2} />
            <pointLight position={[5, 5, 5]} intensity={0.5} color="#F3F4F6" />
            
            <Stars radius={200} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
            
            <Float speed={3} rotationIntensity={1} floatIntensity={1}>
              <mesh>
                <torusGeometry args={[2, 0.1, 16, 100]} />
                <meshStandardMaterial 
                  color="#E5E7EB" 
                  emissive="#E5E7EB" 
                  emissiveIntensity={0.5}
                  metalness={1}
                  roughness={0}
                />
              </mesh>
            </Float>
            
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <mesh>
                <torusGeometry args={[1.5, 0.05, 16, 100]} />
                <meshStandardMaterial 
                  color="#F9FAFB" 
                  emissive="#F9FAFB" 
                  emissiveIntensity={0.7}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
            </Float>
            
            <Center>
              <Text3D
                font="/fonts/Geist_Bold.json"
                size={0.3}
                height={0.05}
              >
                NAVI
                <meshStandardMaterial 
                  color="#F3F4F6" 
                  emissive="#F3F4F6" 
                  emissiveIntensity={0.8}
                  metalness={1}
                  roughness={0}
                />
              </Text3D>
            </Center>
            
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
          </Canvas>
        </div>
        
        {/* Loading Text */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white tracking-wider">
            NAVI AI
          </h1>
          <p className="text-xl text-gray-300 font-light tracking-wide">
            VERSION 10.8.007
          </p>
          <div className="flex items-center justify-center space-x-2 mt-6">
            <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
            <span className="text-gray-400 text-lg">Initializing Neural Networks...</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-80 h-1 bg-gray-800 rounded-full overflow-hidden mt-6">
            <div 
              className="h-full bg-gradient-to-r from-gray-400 to-white rounded-full animate-pulse"
              style={{
                background: 'linear-gradient(90deg, #E5E7EB, #F3F4F6, #F9FAFB)',
                animation: 'loading-progress 3s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PersonalAI() {
  const [selectedMood, setSelectedMood] = useState<Mood>(moods[0])
  const [message, setMessage] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isAlwaysListening, setIsAlwaysListening] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState([
    { type: 'ai', content: 'Hello! I\'m Niva, your 17-year-old CS student AI bestie. How may I assist you today?' }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [smallTalkMode, setSmallTalkMode] = useState(false)
  const [weather, setWeather] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Apply edge lighting effect based on mood
    document.documentElement.style.setProperty('--mood-color', selectedMood.color)
    document.documentElement.style.setProperty('--mood-glow', selectedMood.glowColor)
  }, [selectedMood])

  const fetchWeather = async () => {
    // In a real implementation, you would fetch weather data from an API
    // For now, we'll just set a placeholder
    setWeather('Sunny, 25°C');
  };

  useEffect(() => {
    // Initialize voice recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-IN'; // Indian English

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map(result => result.transcript)
            .join('');

          // Check for wake word
          const lowerTranscript = transcript.toLowerCase();
          if (lowerTranscript.includes('hey niva') || isAlwaysListening) {
            const cleanTranscript = lowerTranscript.replace('hey niva', '').trim();
            if (cleanTranscript || isAlwaysListening) {
              setMessage(cleanTranscript || transcript);
              if (cleanTranscript || isAlwaysListening) {
                // Small delay to ensure state is updated
                setTimeout(() => {
                  handleSendMessage();
                }, 100);
              }
            }
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
        };
      }
    }

    // Update time every minute
    const timeInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }));
    }, 60000);

    // Set initial time
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }));

    // Update weather every 10 minutes
    const weatherInterval = setInterval(() => {
      fetchWeather();
    }, 600000); // 10 minutes

    // Set initial weather
    fetchWeather();

    return () => {
      clearInterval(timeInterval);
      clearInterval(weatherInterval);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isAlwaysListening]);

  const callGeminiAPI = async (prompt: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Add context about Niva's personality
      let fullPrompt = `You are Niva, a 17-year-old CS student and AI bestie with a sweet, helpful, charming, and slightly playful personality.
        You speak with a sweet Indian female tone. Keep responses concise but friendly.
        Current mood: ${selectedMood.name}
        Current time: ${currentTime}
        ${weather ? `Current weather: ${weather}` : ''}
        
        User message: ${prompt}
        
        Remember to respond as Niva with her personality:
        - Be helpful, charming, and slightly playful
        - Use casual, friendly language
        - Keep responses concise but engaging
        - Add emojis occasionally to show personality
        - Be knowledgeable about CS topics since you're a CS student
        - Show empathy and understanding`;
      
      if (smallTalkMode) {
        fullPrompt += `
        
        User has enabled Small Talk mode. In this mode:
        - Be more conversational and casual
        - Feel free to suggest music or discuss light topics
        - You can be more creative and playful
        - Share personal thoughts or experiences as Niva
        - Suggest music based on mood or user preferences if mentioned`;
      }
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return "Sorry, I'm having trouble connecting to my neural network right now. Please try again later!";
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = { type: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Play typing sound effect
    playTypingSound();
    
    // Get AI response
    const aiResponse = await callGeminiAPI(message);
    
    // Remove typing indicator and add AI response
    setIsTyping(false);
    setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
    
    // Speak the response
    speakResponse(aiResponse);
  };

  const speakResponse = (text: string) => {
    if (typeof window !== 'undefined' && (window as any).speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      
      // Try to find an Indian English voice
      const voices = speechSynthesis.getVoices();
      const indianVoice = voices.find(voice =>
        voice.lang.includes('en-IN') ||
        voice.name.includes('India') ||
        voice.name.includes('Google') && voice.lang.includes('en')
      );
      
      if (indianVoice) {
        utterance.voice = indianVoice;
      } else {
        // Fallback to any English voice
        const englishVoice = voices.find(voice =>
          voice.lang.includes('en') && voice.default
        );
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const playTypingSound = () => {
    if (typeof window !== 'undefined' && (window as any).AudioContext) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 440; // A4 note
      gainNode.gain.value = 0.1; // Low volume
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.05); // Short beep
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    setIsListening(!isListening);
    
    if (!isListening) {
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
    }
  };

  const toggleAlwaysListening = () => {
    setIsAlwaysListening(!isAlwaysListening);
    if (!isAlwaysListening && recognitionRef.current) {
      recognitionRef.current.start();
    } else if (isAlwaysListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleSmallTalkMode = () => {
    setSmallTalkMode(!smallTalkMode);
  };

  if (isLoading) {
    return <LoadingAnimation />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 relative overflow-hidden">
      {/* Silver Edge Lighting Effect */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 20% 80%, ${selectedMood.glowColor} 0%, transparent 60%), 
                       radial-gradient(circle at 80% 20%, ${selectedMood.glowColor} 0%, transparent 60%),
                       radial-gradient(circle at 40% 40%, ${selectedMood.glowColor} 0%, transparent 50%)`
        }}
      />
      
      {/* 3D Space Background */}
      <div className="absolute inset-0 opacity-30">
        <SpaceBackground mood={selectedMood} />
      </div>
      
      {/* Main Interface */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="p-6 border-b border-gray-700/30 backdrop-blur-2xl bg-black/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-2"
                style={{ 
                  background: `linear-gradient(135deg, ${selectedMood.color}40, ${selectedMood.color}20)`,
                  borderColor: selectedMood.color,
                  boxShadow: `0 0 30px ${selectedMood.glowColor}, inset 0 0 20px ${selectedMood.glowColor}`
                }}
              >
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-wider">NAVI AI</h1>
                <p className="text-gray-300 text-sm font-mono">VERSION 10.8.007</p>
                <p className="text-gray-400 text-xs mt-1">{selectedMood.description}</p>
                {currentTime && (
                  <p className="text-gray-400 text-xs mt-1">Time: {currentTime}</p>
                )}
                {weather && (
                  <p className="text-gray-400 text-xs mt-1">Weather: {weather}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                onClick={toggleSmallTalkMode}
              >
                <Music className={`w-6 h-6 ${smallTalkMode ? 'text-green-400' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                onClick={toggleAlwaysListening}
              >
                <SunIcon className={`w-6 h-6 ${isAlwaysListening ? 'text-green-400' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <Settings className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </header>

        {/* Mood Selector */}
        <div className="p-6 border-b border-gray-700/30 backdrop-blur-2xl bg-black/20">
          <div className="flex items-center space-x-6 overflow-x-auto pb-2">
            <span className="text-gray-300 text-sm font-semibold whitespace-nowrap">Neural Mode:</span>
            {moods.map((mood) => (
              <Button
                key={mood.id}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMood(mood)}
                className={cn(
                  "flex items-center space-x-3 px-6 py-3 rounded-full transition-all duration-500 whitespace-nowrap font-medium",
                  selectedMood.id === mood.id 
                    ? "text-white shadow-2xl scale-105" 
                    : "text-gray-400 hover:text-white hover:scale-102"
                )}
                style={selectedMood.id === mood.id ? {
                  background: `linear-gradient(135deg, ${mood.color}30, ${mood.color}10)`,
                  border: `2px solid ${mood.color}80`,
                  boxShadow: `0 0 25px ${mood.glowColor}, inset 0 0 15px ${mood.glowColor}`
                } : {}}
              >
                {mood.icon}
                <span className="font-semibold">{mood.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "flex",
                  msg.type === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <Card
                  className={cn(
                    "max-w-md p-6 backdrop-blur-2xl border-2 transition-all duration-300",
                    msg.type === 'user'
                      ? "bg-gradient-to-br from-gray-800/60 to-gray-700/60 text-white border-gray-600/50"
                      : "bg-gradient-to-br from-black/70 to-gray-900/70 text-gray-100 shadow-2xl"
                  )}
                  style={msg.type === 'ai' ? {
                    borderColor: `${selectedMood.color}60`,
                    boxShadow: `0 0 20px ${selectedMood.glowColor}, inset 0 0 10px ${selectedMood.glowColor}`
                  } : {}}
                >
                  <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                </Card>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <Card
                  className="max-w-md p-6 backdrop-blur-2xl border-2 transition-all duration-300 bg-gradient-to-br from-black/70 to-gray-900/70 text-gray-100 shadow-2xl"
                  style={{
                    borderColor: `${selectedMood.color}60`,
                    boxShadow: `0 0 20px ${selectedMood.glowColor}, inset 0 0 10px ${selectedMood.glowColor}`
                  }}
                >
                  <p className="text-sm leading-relaxed font-medium">Niva is typing...</p>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-700/30 backdrop-blur-2xl bg-black/30">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Communicate with NAVI..."
                  className="bg-gray-800/60 border-2 text-white placeholder-gray-400 pr-14 py-4 text-lg font-medium backdrop-blur-2xl"
                  style={{
                    borderColor: `${selectedMood.color}40`,
                    boxShadow: `0 0 15px ${selectedMood.glowColor}, inset 0 0 10px ${selectedMood.glowColor}`
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${selectedMood.color}, ${selectedMood.color}80)`,
                    boxShadow: `0 0 20px ${selectedMood.glowColor}`
                  }}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              
              <Button
                onClick={toggleListening}
                size="icon"
                variant={isListening ? "default" : "ghost"}
                className={cn(
                  "h-12 w-12 rounded-full transition-all duration-300",
                  isListening ? "animate-pulse scale-110" : "hover:scale-105"
                )}
                style={isListening ? {
                  background: `linear-gradient(135deg, ${selectedMood.color}, ${selectedMood.color}80)`,
                  boxShadow: `0 0 25px ${selectedMood.glowColor}`
                } : {}}
              >
                <Mic className="w-6 h-6" />
              </Button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center justify-center space-x-6 mt-6">
              <Badge
                variant="secondary"
                className="bg-gray-800/60 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 backdrop-blur-2xl px-4 py-2 text-sm font-medium border border-gray-600/50"
                style={{
                  boxShadow: `0 0 10px ${selectedMood.glowColor}`
                }}
                onClick={toggleSmallTalkMode}
              >
                <Music className="w-4 h-4 mr-2" />
                {smallTalkMode ? 'Small Talk ON' : 'Small Talk OFF'}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gray-800/60 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 backdrop-blur-2xl px-4 py-2 text-sm font-medium border border-gray-600/50"
                style={{
                  boxShadow: `0 0 10px ${selectedMood.glowColor}`
                }}
                onClick={toggleAlwaysListening}
              >
                <SunIcon className="w-4 h-4 mr-2" />
                {isAlwaysListening ? 'Always Listening ON' : 'Always Listening OFF'}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gray-800/60 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 backdrop-blur-2xl px-4 py-2 text-sm font-medium border border-gray-600/50"
                style={{
                  boxShadow: `0 0 10px ${selectedMood.glowColor}`
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Matrix
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
