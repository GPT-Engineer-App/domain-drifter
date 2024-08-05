import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, ChevronDown, Plus, X, Edit, Trash, Lock, Book, Tool, DollarSign } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useDomains, useAddDomain, useUpdateDomain, useDeleteDomain } from '@/integrations/supabase';

const domainTypes = [
  { name: 'Trust', icon: Lock },
  { name: 'Knowledge', icon: Book },
  { name: 'Tools', icon: Tool },
  { name: 'Exchange', icon: DollarSign },
];

const defaultParticles = {
  Trust: ['Security Protocol', 'Identity Verification', 'Trust Score'],
  Knowledge: ['Learning Path', 'Webinar', 'Information Sharing'],
  Tools: ['Task Management', 'Timeline', 'Resource Allocation'],
  Exchange: ['Payment Processing', 'Service Listing', 'Reviews'],
};

const Index = () => {
  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState({ name: '', type: '' });
  const [perspectives, setPerspectives] = useState(['Default']);
  const [selectedPerspective, setSelectedPerspective] = useState('Default');
  const [newPerspective, setNewPerspective] = useState('');

  const addDomain = () => {
    if (newDomain.name.trim() !== '' && newDomain.type !== '') {
      const newDomainObj = {
        id: Date.now(),
        name: newDomain.name.trim(),
        type: newDomain.type,
        perspectives: {
          Default: {}
        }
      };
      setDomains([...domains, newDomainObj]);
      setNewDomain({ name: '', type: '' });
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
      <h1 className="text-4xl font-bold mb-8 text-center">Ontological Domain Navigator</h1>
      
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Define New Domain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter domain name"
                value={newDomain.name}
                onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
                className="flex-grow"
              />
              <Select value={newDomain.type} onValueChange={(value) => setNewDomain({ ...newDomain, type: value })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {domainTypes.map((type) => (
                    <SelectItem key={type.name} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addDomain}>Define Domain</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ontological Perspectives</CardTitle>
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
              <Button onClick={addPerspective}>Add Perspective</Button>
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

        {domains.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-lg text-gray-600">No domains defined yet. Start by defining a new domain above.</p>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {domains.map((domain) => {
              const DomainIcon = domainTypes.find(type => type.name === domain.type)?.icon || Globe;
              return (
                <AccordionItem key={domain.id} value={`item-${domain.id}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <Card className="w-full bg-white hover:shadow-lg transition-shadow">
                      <CardContent className="flex items-center p-4">
                        <DomainIcon className="h-6 w-6 mr-2 text-blue-500" />
                        <span className="text-lg font-medium">{domain.name}</span>
                        <ChevronDown className="h-4 w-4 ml-auto" />
                      </CardContent>
                    </Card>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-gray-50 rounded-b-lg">
                      <p><strong>Type:</strong> {domain.type}</p>
                      <p><strong>Perspective:</strong> {selectedPerspective}</p>
                      <p className="mt-2 italic">This domain's ontological properties are yet to be defined.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default Index;
