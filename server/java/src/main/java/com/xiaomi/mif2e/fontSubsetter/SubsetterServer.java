package com.xiaomi.mif2e.fontSubsetter;

import org.apache.thrift.server.TServer;
import org.apache.thrift.server.TThreadPoolServer;
import org.apache.thrift.transport.TServerSocket;
import org.apache.thrift.transport.TServerTransport;

public class SubsetterServer {

	private static SubsetterServiceHandler handler;
	@SuppressWarnings("rawtypes")
	private static SubsetterService.Processor processor;

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static void main(String[] args) {
		try {
			handler = new SubsetterServiceHandler();
			processor = new SubsetterService.Processor(handler);

			Runnable simple = new Runnable() {
				public void run() {
					thread(processor);
				}
			};
			new Thread(simple).start();
		} catch (Exception x) {
			x.printStackTrace();
		}
	}

	@SuppressWarnings("rawtypes")
	public static void thread(SubsetterService.Processor processor) {
		try {
			TServerTransport serverTransport = new TServerSocket(10090);
			TServer server = new TThreadPoolServer(new TThreadPoolServer.Args(
					serverTransport).processor(processor));
			System.out.println("Starting the TThreadPoolServer...");
			server.serve();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
