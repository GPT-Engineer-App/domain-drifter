import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

const Index = () => {
  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState('');

  const addDomain = () => {
    if (newDomain.trim() !== '') {
      setDomains([...domains, newDomain.trim()]);
      setNewDomain('');
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center p-4">
                <Globe className="h-6 w-6 mr-2 text-blue-500" />
                <span className="text-lg font-medium">{domain}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
