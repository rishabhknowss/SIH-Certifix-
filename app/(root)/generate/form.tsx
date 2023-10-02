"use client";
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Web3 from 'web3';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { certificateDetailStore } from "@/hooks/certificate-detail-store";
import { useRouter } from "next/router";


const formSchema = z.object({
  name: z.string().min(2, "The name must be more than two alphabets"),
  phone: z.string().length(10, "Phone number should be of 10 digits"),
  email: z.string().email("The email should be valid"),
  adhar_number: z.string().min(12, "Adhar number should be valid"),
  competetion: z.string(),
});

export function GenerateForm() {
  const updateDetails = certificateDetailStore((state) => state.updateDetails);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      adhar_number: "",
    },
    mode: "onChange",
  });

  const [randomHash, setRandomHash] = useState(""); // State to store the random hash
  const [contractInstance, setContractInstance] = useState(null); // State to store the contract instance

  // Initialize Web3 with your Ethereum provider (e.g., MetaMask)
  const web3 = new Web3(window.ethereum);

  useEffect(() => {
    // Initialize the contract instance with the deployed contract address
    const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your deployed contract address
    const contractABI = [ // Replace with your contract's ABI
      // ABI definition for your contract functions
    ];

    const contract = new web3.eth.Contract(contractABI, contractAddress);
    setContractInstance(contract);
  }, []);

  useEffect(() => {
    if (contractInstance) {
      // Fetch the random hash from the smart contract
      contractInstance.methods.randomHash().call()
        .then((hash) => {
          setRandomHash(hash);
        })
        .catch((error) => {
          console.error('Error fetching random hash:', error);
        });
    }
  }, [contractInstance]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Ensure that the wallet is connected
      if (!window.ethereum.selectedAddress) {
        // If the wallet is not connected, you can show an error message to the user.
        console.error('Wallet is not connected.');
        return;
      }

      // Create a transaction object
      const transaction = {
        to: 'YOUR_SMART_CONTRACT_ADDRESS', // Replace with the recipient address
        value: web3.utils.toWei('0.1', 'ether'), // Replace with the desired amount in ether
        data: '0x', // Replace with the contract function call data if applicable
      };

      // Send the transaction
      const accounts = await web3.eth.getAccounts();
      const result = await web3.eth.sendTransaction({ ...transaction, from: accounts[0] });

      console.log('Transaction result:', result);

      // Update your app's state or perform any additional actions
      updateDetails({
        name: values.name,
        phone: values.phone,
        email: values.email,
        adhar: values.adhar_number,
        competetion: values.competetion,
      });
      router.push("/certificate");
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  }

  const formFields = [
    {
      label: "Name",
      name: "name",
      placeholder: "Name",
    },
    {
      label: "Phone no.",
      placeholder: "+91 1234567890",
      name: "phone",
    },
    {
      label: "Email",
      placeholder: "example@something.com",
      name: "email",
    },
    {
      label: "Adhar number",
      name: "adhar_number",
      placeholder: "1234 5678 9012",
    },
  ];

  const competetion = [
    "Competetion 1",
    "Competetion 2",
    "Competetion 3",
    "Competetion 4",
    "Competetion 5",
    "Competetion 6",
    "Competetion 7",
    "Competetion 8",
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 border rounded-lg p-8 m-auto w-[400px] max-w-[100vw]"
      >
        {formFields.map((formField) => (
          <FormField
            control={form.control}
            key={formField.name}
            name={formField.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{formField.label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={formField.placeholder || ""}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <FormField
          control={form.control}
          name="competetion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Competetion</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Certificate For" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Certificate For</SelectLabel>
                    {competetion.map((comp) => (
                      <SelectItem value={comp} key={comp}>
                        {comp}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button type="submit">Generate</Button>

        {/* Display the random hash from the smart contract */}
        {randomHash && (
          <div>
            <p>Random Hash: {randomHash}</p>
          </div>
        )}
      </form>
    </Form>
  );
}
