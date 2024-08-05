import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Index = () => {
  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState('');

  const addDomain = () => {
    if (newDomain.trim() !== '') {
      setDomains([...domains, {
        name: newDomain.trim(),
        particles: {
          dns: Math.random() < 0.5 ? 'A' : 'CNAME',
          ssl: Math.random() < 0.5 ? 'Valid' : 'Expired',
          status: Math.random() < 0.5 ? 'Active' : 'Inactive'
        }
      }]);
      setNewDomain('');
    }
  };

  // Ensure existing domains have particles
  React.useEffect(() => {
    setDomains(prevDomains => prevDomains.map(domain => ({
      ...domain,
      particles: domain.particles || {
        dns: 'N/A',
        ssl: 'N/A',
        status: 'N/A'
      }
    })));
  }, []);

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
                  <p><strong>DNS:</strong> {domain.particles?.dns || 'N/A'}</p>
                  <p><strong>SSL:</strong> {domain.particles?.ssl || 'N/A'}</p>
                  <p><strong>Status:</strong> {domain.particles?.status || 'N/A'}</p>
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
