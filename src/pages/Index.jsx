import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, ChevronDown, Plus, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState('');
  const [perspectives, setPerspectives] = useState(['Default']);
  const [selectedPerspective, setSelectedPerspective] = useState('Default');
  const [newPerspective, setNewPerspective] = useState('');

  const addDomain = () => {
    if (newDomain.trim() !== '') {
      setDomains([...domains, {
        name: newDomain.trim(),
        perspectives: {
          Default: {
            dns: Math.random() < 0.5 ? 'A' : 'CNAME',
            ssl: Math.random() < 0.5 ? 'Valid' : 'Expired',
            status: Math.random() < 0.5 ? 'Active' : 'Inactive'
          }
        }
      }]);
      setNewDomain('');
    }
  };

  const addPerspective = () => {
    if (newPerspective.trim() !== '' && !perspectives.includes(newPerspective.trim())) {
      setPerspectives([...perspectives, newPerspective.trim()]);
      setNewPerspective('');
    }
  };

  const removePerspective = (perspective) => {
    if (perspective !== 'Default') {
      setPerspectives(perspectives.filter(p => p !== perspective));
      if (selectedPerspective === perspective) {
        setSelectedPerspective('Default');
      }
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Domain Navigator</h1>
      
      <div className="max-w-2xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Domain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter domain name"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={addDomain}>Add Domain</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Manage Perspectives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                type="text"
                placeholder="New perspective name"
                value={newPerspective}
                onChange={(e) => setNewPerspective(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={addPerspective}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {perspectives.map((perspective) => (
                <div key={perspective} className="flex items-center bg-gray-200 rounded-full px-3 py-1">
                  <span>{perspective}</span>
                  {perspective !== 'Default' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 p-0"
                      onClick={() => removePerspective(perspective)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mb-4">
          <Select value={selectedPerspective} onValueChange={setSelectedPerspective}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a perspective" />
            </SelectTrigger>
            <SelectContent>
              {perspectives.map((perspective) => (
                <SelectItem key={perspective} value={perspective}>
                  {perspective}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {domains.map((domain, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="hover:no-underline">
                <Card className="w-full bg-white hover:shadow-lg transition-shadow">
                  <CardContent className="flex items-center p-4">
                    <Globe className="h-6 w-6 mr-2 text-blue-500" />
                    <span className="text-lg font-medium">{domain.name}</span>
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  </CardContent>
                </Card>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-gray-50 rounded-b-lg">
                  <p><strong>DNS:</strong> {domain.perspectives[selectedPerspective]?.dns || 'N/A'}</p>
                  <p><strong>SSL:</strong> {domain.perspectives[selectedPerspective]?.ssl || 'N/A'}</p>
                  <p><strong>Status:</strong> {domain.perspectives[selectedPerspective]?.status || 'N/A'}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default Index;
