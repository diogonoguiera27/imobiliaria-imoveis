import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function ContatoCard() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [contato, setContato] = useState("Telefone");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mensagem = `Olá! Meu nome é ${nome}, meu e-mail é ${email}, meu telefone é ${telefone}, e prefiro contato via ${contato}.`;
    const url = `https://wa.me/5562994035584?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-200 !p-6 !space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Fale com um corretor
          </h2>
          <p className="text-sm text-gray-500">
            Preencha os campos abaixo com seus dados e um de nossos corretores
            entrará em contato.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="!space-y-4">
          <div>
            <Label className="!block !text-sm !font-semibold !text-gray-700 !mb-1">
              Seu nome:
            </Label>
            <Input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
              required
              className="w-full !border !border-gray-300 !rounded-md !px-4 !py-2 !text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="grid !grid-cols-1 !md:grid-cols-2 !gap-4 " >
            <div>
              <Label className="!block !text-sm !font-semibold !text-gray-700 !mb-1">
                E-mail:
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                required
                className="w-full !border !border-gray-300 !rounded-md !px-4 !py-2 !text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="!space-y-2">
              <Label className="!block !text-sm !font-semibold text-gray-700 mb-1">
                Celular:
              </Label>
              <Input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(xx) xxxxx-xxxx"
                required
                className="w-full !border !border-gray-300 !rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div className="!space-y-2">
            <Label className="!block !text-sm !font-semibold !text-gray-700">
              Forma de contato:
            </Label>

            <Select
              value={contato}
              onValueChange={(value) => setContato(value)}
            >
              <SelectTrigger className="w-full !border !border-gray-300 !rounded-md !px-4 !py-2 !text-sm !shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>

              <SelectContent className="!rounded-md !border !border-gray-200 !shadow-lg !bg-white">
                <SelectItem
                  value="Telefone"
                  className="!cursor-pointer !px-4 !py-2 !text-sm !text-gray-800 !hover:bg-pink-50 !focus:bg-pink-100"
                >
                  Telefone
                </SelectItem>
                <SelectItem
                  value="WhatsApp"
                  className="!cursor-pointer !px-4 !py-2 !text-sm !text-gray-800 !hover:bg-pink-50 !focus:bg-pink-100"
                >
                  WhatsApp
                </SelectItem>
                <SelectItem
                  value="Email"
                  className="!cursor-pointer !px-4 !py-2 !text-sm !text-gray-800 !hover:bg-pink-50 !focus:bg-pink-100"
                >
                  E-mail
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full !bg-green-700 !hover:bg-green-700 !text-white !font-bold !py-2 !rounded-md !transition"
          >
            Enviar Mensagem
          </Button>
        </form>
      </div>
    </div>
  );
}
