import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { ChevronLeft, Send, MessageCircle, HelpCircle, History } from 'lucide-react-native';
import { useSettingsStore } from '../src/store/useSettingsStore';
import { AuraBackground } from '../src/components/AuraBackground';

const MOCK_MESSAGES = [
  { id: '1', text: 'Hello! I am your ExpenseMaster AI Assistant. How can I help you optimize your wealth today?', sender: 'ai' },
];

export default function Support() {
  const router = useRouter();
  const { theme } = useSettingsStore(s => s.settings);
  const isDark = theme === 'dark' || theme === 'system';
  
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState(MOCK_MESSAGES);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const newUserMsg = { id: Date.now().toString(), text: message, sender: 'user' };
    setChat(prev => [...prev, newUserMsg]);
    setMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiMsg = { 
        id: (Date.now() + 1).toString(), 
        text: "I've received your request! Our global support team (or our advanced AI) will get back to you shortly. For now, check your 'Financial Aura' to stay on track!", 
        sender: 'ai' 
      };
      setChat(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <AuraBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']} className={`${isDark ? 'bg-background/80' : 'bg-gray-50/80'}`}>
        <View className="flex-row items-center px-5 py-4 border-b border-gray-200 dark:border-slate-800">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-gray-200 dark:bg-card rounded-full">
            <ChevronLeft color={isDark ? '#f8fafc' : '#1e293b'} size={24} />
          </TouchableOpacity>
          <View>
            <Text className={`text-xl font-bold ${isDark ? 'text-textPrimary' : 'text-gray-900'}`}>
              Online Support
            </Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
              <Text className={`text-xs ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>Agent Online (Global First)</Text>
            </View>
          </View>
        </View>

        <ScrollView 
          className="flex-1 px-5 py-4"
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-3xl ${isDark ? 'bg-card' : 'bg-white'} shadow-sm mb-6 flex-row items-center`}
          >
            <HelpCircle color="#10b981" size={40} className="mr-4" />
            <View className="flex-1">
              <Text className={`font-bold text-lg ${isDark ? 'text-textPrimary' : 'text-gray-900'}`}>Need help?</Text>
              <Text className={`text-sm ${isDark ? 'text-textSecondary' : 'text-gray-500'}`}>Our 24/7 AI Concierge is ready to help you with budgeting or technical issues.</Text>
            </View>
          </MotiView>

          {chat.map((msg, index) => (
            <MotiView
              key={msg.id}
              from={{ opacity: 0, translateX: msg.sender === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: index * 100 }}
              className={`mb-4 max-w-[85%] p-4 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-primary self-end' 
                  : isDark ? 'bg-slate-800 self-start' : 'bg-white self-start shadow-sm'
              }`}
            >
              <Text className={`text-sm font-medium ${msg.sender === 'user' ? 'text-white' : isDark ? 'text-textPrimary' : 'text-gray-900'}`}>
                {msg.text}
              </Text>
            </MotiView>
          ))}
        </ScrollView>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          className="px-5 py-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-card"
        >
          <View className="flex-row items-center bg-gray-100 dark:bg-slate-900 rounded-full px-4 py-2">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message..."
              placeholderTextColor={isDark ? '#475569' : '#94a3b8'}
              className={`flex-1 ${isDark ? 'text-textPrimary' : 'text-gray-900'} h-10`}
            />
            <TouchableOpacity onPress={handleSend} className="ml-2 bg-primary p-2 rounded-full">
              <Send color="white" size={20} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuraBackground>
  );
}
